import { Injectable, BadRequestException, NotFoundException, Inject, forwardRef, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WalletService } from '../wallet/wallet.service';
import { Transaction, TransactionType, TransactionStatus } from '../wallet/entities/transaction.entity';
import { WalletType } from '../wallet/entities/wallet.entity';
import * as crypto from 'crypto';
import { BillPaymentDto } from './dto/payments.dto';
import { XpressWalletSDK } from '../xpress-wallet';
import { ConfigService } from '@nestjs/config';
import flutterwave from '@api/flutterwave-v3';

@Injectable()
export class PaymentsService {
  private readonly xpressService: XpressWalletSDK;
  
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject(forwardRef(() => WalletService))
    private walletService: WalletService,
    private eventEmitter: EventEmitter2,
    private readonly config: ConfigService,
  ) {
    this.xpressService = new XpressWalletSDK({
      xpressEmail: this.config.get<string>('XPRESS_EMAIL'),
      xpressPassword: this.config.get<string>('XPRESS_PASSWORD'),
      baseUrl: this.config.get<string>('XPRESS_BASEURL'),
    });
  }

  async getAccountInfo(): Promise<{ 
    account_number: string; 
    bank_code: string; 
    account_name: string; 
    bank_name: string 
  }> {
    const account_number = this.config.get('FLUTTER_WAVE_ACCOUNT_NUMBER');
    const account_name = this.config.get('FUTTER_WAVE_ACCOUNT_NAME');
    const bank_name = this.config.get('FLUTTER_WAVE_BANK_NAME');
    const bank_code = this.config.get('FLUTTER_WAVE_BANK_CODE');

    return({ 
      account_number: String(account_number), 
      bank_code: String(bank_code), 
      account_name: String(account_name), 
      bank_name: String(bank_name) 
    })
  }

  async payBill(userId: string, walletId: string, billData: BillPaymentDto): Promise<Transaction> {
    const wallet = await this.walletService.findWalletById(walletId);
    if (!wallet) {
      throw new NotFoundException('Wallet not found for user');
    }

    if (wallet.balance < billData.amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    // Create transaction record
    const transaction = await this.walletService.withdraw(userId, TransactionType.BILL_PAYMENT, { amount: billData.amount }, billData)

    try {
      // Deduct from wallet
      const { deducted, reason, reference, status } = await this.deductFromWallet({
        walletId: wallet.id,
        amount: billData.amount,
        type: "bill_payment",
        customer: billData.customer,
        biller_code: billData.biller_code,
        item_code: billData.item_code,
        narration: billData.type
      });

      if(deducted && !status.toLowerCase().includes("pending")) {
        this.walletService.withdrawComplete(transaction.id, reference, userId)
      } 
      
      if(!deducted){
        await this.walletService.withdrawFailed(transaction.id, reason, userId);
        throw new BadRequestException(reason);
      }

      this.eventEmitter.emit('bill.paid', { transaction: transaction });

      return transaction;
    } catch (error) {
      await this.walletService.withdrawFailed(transaction.id, error.message, userId);
      throw new BadRequestException(error.message || 'Bill payment failed');
    }
  }

  async validateCustomer(code: string, customer: number): Promise<any> {
    try {
      return await flutterwave.getV3BillItemsCb141Validate({
        customer,
        code,
        Authorization: `Bearer ${this.config.get('FLUTTERWAVE_SECRET_KEY')}`
      });
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

  private async deductFromWallet({
    walletId,
    amount,
    type, 
    customer,
    biller_code,
    item_code,
    narration
  }: {
    walletId: string,  
    amount: number, 
    type: "withdrawal" | "bill_payment" | "wallet_external" | "escrow" | "wallet_internal",  
    customer?: string, 
    biller_code?: string,
    item_code?: string,
    narration?: string
  }): Promise<({ deducted: boolean, reason?: string, reference?: string, status?: string })> {
    const wallet = await this.walletService.findWalletById(walletId);
    if (!wallet) {
      throw new NotFoundException('Wallet not found for user');
    }

    const reference = this.generateReference('BILL');

    if(type == "bill_payment") {
      if(!customer) {
        throw new ConflictException("Customer number required");
      }

      if(!biller_code) {
        throw new ConflictException("Biller Code required");
      }

      if(!item_code) {
        throw new ConflictException("Item Code required");
      }

      const account_info = await this.getAccountInfo();

      // 4. Move funds from XpressWallet to Flutterwave
      const xdata = await this.xpressService.transfer.customerBankTransfer({
        customerId: wallet.customerId,
        accountName: account_info.account_name,
        accountNumber: account_info.account_number,
        sortCode: account_info.bank_code,
        amount: amount,
        narration: `Bill Payment ${narration}`,
      });

      if(!xdata.status || !xdata.transfer) {
        return({ deducted: false, reason: xdata.message })
      }

      // 5. Call Flutterwave Bills API
      const fwResponse = await flutterwave.postV3BillersBiller_codeItemsItem_codePayment({
        country: 'NG',
        customer_id: customer,
        amount: amount,
        reference,
        biller_code,
        item_code,
        Authorization: `Bearer ${this.config.get('FLUTTERWAVE_SECRET_KEY')}`
      });

      if(fwResponse.status != 200 || !fwResponse.data.data) {
        return({ deducted: false, reason: fwResponse.data.message, status: fwResponse.data.status })
      }

      this.eventEmitter.emit('wallet.debit', { walletId, amount });
      return({ deducted: true, reference: fwResponse.data.data.tx_ref })
    }
  }

  private generateReference(prefix: string): string {
    return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  }
}