import { Injectable, NotFoundException, BadRequestException, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecurrenceFrequency, RecurringPayment, RecurringStatus } from './entities/recurring-payment.entity';
import { Bill } from './entities/bill.entity';
import { PaymentsService } from '../payments/payments.service';
import { BillPaymentDto } from '../payments/dto/payments.dto';
import { User } from '../users/entities/user.entity';
import { RecurringPaymentsService } from './recurring-payments.service';
import flutterwave from '@api/flutterwave-v3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BillsService {
  private readonly logger = new Logger(BillsService.name);

  constructor(
    @InjectRepository(Bill)
    private billRepository: Repository<Bill>,
    @InjectRepository(RecurringPayment)
    private recurringRepository: Repository<RecurringPayment>,
    @Inject(forwardRef(() => RecurringPaymentsService))
    private recurringService: RecurringPaymentsService,
    @Inject(forwardRef(() => PaymentsService))
    private paymentsService: PaymentsService,
    private config: ConfigService,
  ) {}

  /**
   * Fetch available providers from Flutterwave
   */
  async getProviders(): Promise<any> {
    const response = await flutterwave.getV3TopBillCategories({
      country: "NG",
      Authorization: `Bearer ${this.config.get('FLUTTERWAVE_SECRET_KEY')}`
    });
    return response.data;
  }

  /**
   * Fetch available plans from Flutterwave
   */
  async getBillers(category: string): Promise<any> {
    const response = await flutterwave.getV3BillsCategoryBillers({
      country: "NG",
      category,
      Authorization: `Bearer ${this.config.get('FLUTTERWAVE_SECRET_KEY')}`
    });
    return response.data;
  }

  /**
   * Fetch available plans from Flutterwave
   */
  async getPlans(code: string): Promise<any> {
    const response = await flutterwave.getV3BillersBiller_codeItems({
      biller_code: code,
      Authorization: `Bearer ${this.config.get('FLUTTERWAVE_SECRET_KEY')}`
    });
    return response.data;
  }

  /**
   * Verify service account e.g meter no, smartcard, etc
   */
  async verifyServiceAccount(code: string, customer: number) {
    const response = await flutterwave.getV3BillItemsCb141Validate({ 
      code, 
      customer,
      Authorization: `Bearer ${this.config.get('FLUTTERWAVE_SECRET_KEY')}`
    });
    return response.data;
  }

  /**
   * Pay a bill (core flow)
   */
  async payBill(userId: string, walletId: string, dto: BillPaymentDto, recurring: boolean, duration: number) {
    try {
      const response = await this.paymentsService.payBill(userId, walletId, dto);

      if(recurring) {
        await this.recurringService.createRecurringPayment({
        userId: userId,
        transactionId: response.id,
        amount: response.amount,
        duration,
        frequency: 
          duration == 1?
            RecurrenceFrequency.DAILY
          : duration == 7?
            RecurrenceFrequency.WEEKLY 
          : duration == 30 || duration == 31?
            RecurrenceFrequency.MONTHLY
          : RecurrenceFrequency.CUSTOM
        ,
        status: RecurringStatus.ACTIVE,
        });
      }

      return response;
    } catch (err) {
      this.logger.error(`Bill payment failed: ${err.message}`, err.stack);

      throw new BadRequestException(`Bill payment failed: ${err.message}`);
    }
  }

  async checkServiceDowntime(billerCode: string): Promise<boolean> {
    const bill = await this.billRepository.findOne({
      where: { billerCode },
    });

    if (!bill) return false;

    return bill.hasDowntime && 
           bill.downtimeStart && 
           bill.downtimeEnd && 
           new Date() >= bill.downtimeStart && 
           new Date() <= bill.downtimeEnd;
  }
}
