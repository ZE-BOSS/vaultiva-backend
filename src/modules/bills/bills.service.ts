import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ServiceUnavailableException,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
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
   * Flutterwave's bill endpoints are the only source for providers, billers and
   * plans. Without a secret key the generated client throws a raw error and the
   * request surfaces as an opaque 500, so fail with something actionable instead.
   */
  private flutterwaveAuth(): string {
    const key = this.config.get<string>('FLUTTERWAVE_SECRET_KEY');
    if (!key) {
      throw new ServiceUnavailableException(
        'Bill payments are unavailable: FLUTTERWAVE_SECRET_KEY is not configured.',
      );
    }
    return `Bearer ${key}`;
  }

  /**
   * Fetch available providers from Flutterwave
   */
  async getProviders(): Promise<any> {
    const response = await flutterwave.getV3TopBillCategories({
      country: "NG",
      Authorization: this.flutterwaveAuth()
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
      Authorization: this.flutterwaveAuth()
    });
    return response.data;
  }

  /**
   * Fetch available plans from Flutterwave
   */
  async getPlans(code: string): Promise<any> {
    const response = await flutterwave.getV3BillersBiller_codeItems({
      biller_code: code,
      Authorization: this.flutterwaveAuth()
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
      Authorization: this.flutterwaveAuth()
    });
    return response.data;
  }

  /**
   * Pay a bill (core flow)
   */
  async payBill(userId: string, walletId: string, dto: BillPaymentDto, recurring: boolean = false, duration: number = 0) {
    try {
      const response = await this.paymentsService.payBill(userId, walletId, dto);

      if (recurring && duration > 0) {
        await this.recurringService.createRecurringPayment({
          userId: userId,
          transactionId: response.id,
          amount: response.amount,
          duration,
          frequency: this.determineFrequency(duration),
          status: RecurringStatus.ACTIVE,
        });
      }

      return response;
    } catch (err) {
      this.logger.error(`Bill payment failed: ${err.message}`, err.stack);

      throw new BadRequestException(`Bill payment failed: ${err.message}`);
    }
  }

  private determineFrequency(duration: number): RecurrenceFrequency {
    if (duration === 1) return RecurrenceFrequency.DAILY;
    if (duration === 7) return RecurrenceFrequency.WEEKLY;
    if (duration === 30 || duration === 31) return RecurrenceFrequency.MONTHLY;
    return RecurrenceFrequency.CUSTOM;
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