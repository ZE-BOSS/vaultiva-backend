import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FlutterwaveService } from './services/flutterwave.service';
import { WalletService } from '../wallet/wallet.service';
import { Transaction, TransactionType, TransactionStatus } from '../wallet/entities/transaction.entity';
import * as crypto from 'crypto';

export interface BillPaymentDto {
  type: string;
  amount: number;
  customer: string;
  biller_name?: string;
  country?: string;
  recurrence?: string;
}

export interface AirtimeDto {
  amount: number;
  phone: string;
  network: string;
}

export interface DataDto {
  amount: number;
  phone: string;
  network: string;
  plan: string;
}

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private flutterwaveService: FlutterwaveService,
    private walletService: WalletService,
    private eventEmitter: EventEmitter2,
  ) {}

  async getBillCategories(): Promise<any> {
    return this.flutterwaveService.getBillCategories();
  }

  async payBill(userId: string, billData: BillPaymentDto): Promise<Transaction> {
    const wallet = await this.walletService.findByUserId(userId);

    if (wallet.availableBalance < billData.amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    const reference = this.generateReference('BILL');

    // Create transaction record
    const transaction = this.transactionRepository.create({
      reference,
      type: TransactionType.BILL_PAYMENT,
      amount: billData.amount,
      status: TransactionStatus.PROCESSING,
      description: `${billData.type} payment`,
      walletId: wallet.id,
      userId,
      metadata: {
        billType: billData.type,
        customer: billData.customer,
        biller_name: billData.biller_name,
      },
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    try {
      // Process bill payment with Flutterwave
      const paymentResponse = await this.flutterwaveService.payBill({
        ...billData,
        reference,
        country: billData.country || 'NG',
        recurrence: billData.recurrence || 'ONCE',
      });

      // Deduct from wallet
      await this.deductFromWallet(wallet.id, billData.amount);

      savedTransaction.status = TransactionStatus.COMPLETED;
      savedTransaction.providerReference = paymentResponse.reference;
      await this.transactionRepository.save(savedTransaction);

      this.eventEmitter.emit('bill.paid', { transaction: savedTransaction });

      return savedTransaction;
    } catch (error) {
      savedTransaction.status = TransactionStatus.FAILED;
      savedTransaction.failureReason = error.message;
      await this.transactionRepository.save(savedTransaction);

      throw new BadRequestException(error.message || 'Bill payment failed');
    }
  }

  async buyAirtime(userId: string, airtimeData: AirtimeDto): Promise<Transaction> {
    const billData: BillPaymentDto = {
      type: 'AIRTIME',
      amount: airtimeData.amount,
      customer: airtimeData.phone,
      biller_name: airtimeData.network,
    };

    return this.payBill(userId, billData);
  }

  async buyData(userId: string, dataData: DataDto): Promise<Transaction> {
    const billData: BillPaymentDto = {
      type: 'DATA_BUNDLE',
      amount: dataData.amount,
      customer: dataData.phone,
      biller_name: `${dataData.network}_${dataData.plan}`,
    };

    return this.payBill(userId, billData);
  }

  async payElectricity(userId: string, electricityData: {
    amount: number;
    meterNumber: string;
    discoName: string;
    meterType: string;
  }): Promise<Transaction> {
    const billData: BillPaymentDto = {
      type: 'ELECTRICITY',
      amount: electricityData.amount,
      customer: electricityData.meterNumber,
      biller_name: electricityData.discoName,
    };

    return this.payBill(userId, billData);
  }

  async payTvSubscription(userId: string, tvData: {
    amount: number;
    smartCardNumber: string;
    tvProvider: string;
    package: string;
  }): Promise<Transaction> {
    const billData: BillPaymentDto = {
      type: 'TV_SUBSCRIPTION',
      amount: tvData.amount,
      customer: tvData.smartCardNumber,
      biller_name: `${tvData.tvProvider}_${tvData.package}`,
    };

    return this.payBill(userId, billData);
  }

  async payInternetBill(userId: string, internetData: {
    amount: number;
    customerId: string;
    provider: string;
    plan: string;
  }): Promise<Transaction> {
    const billData: BillPaymentDto = {
      type: 'INTERNET',
      amount: internetData.amount,
      customer: internetData.customerId,
      biller_name: `${internetData.provider}_${internetData.plan}`,
    };

    return this.payBill(userId, billData);
  }

  async validateCustomer(billType: string, customer: string, billerCode?: string): Promise<any> {
    try {
      return await this.flutterwaveService.validateBillService(billType, billerCode || billType, customer);
    } catch (error) {
      throw new BadRequestException(error.message || 'Customer validation failed');
    }
  }

  async getTransactionStatus(reference: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { reference },
      relations: ['wallet', 'wallet.user'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  private async deductFromWallet(walletId: string, amount: number): Promise<void> {
    // This should be done in a transaction to ensure consistency
    // Implementation would involve updating wallet balance
    // For now, we'll emit an event that the wallet service can handle
    this.eventEmitter.emit('wallet.debit', { walletId, amount });
  }

  private generateReference(prefix: string): string {
    return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  }
}