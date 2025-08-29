import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecurrenceFrequency, RecurringPayment, RecurringStatus } from './entities/recurring-payment.entity';
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
    @InjectRepository(RecurringPayment)
    private recurringService: RecurringPaymentsService,
    private paymentsService: PaymentsService,
    private config: ConfigService,
  ) {}

  /**
   * Fetch available providers from Flutterwave
   */
  async getProviders(): Promise<any> {
    return flutterwave.getV3TopBillCategories({
      country: "NG",
      Authorization: `Bearer ${this.config.get('FLUTTERWAVE_SECRET_KEY')}`
    });
  }

  /**
   * Fetch available plans from Flutterwave
   */
  async getBillers(category: string): Promise<any> {
    return flutterwave.getV3BillsCategoryBillers({
      country: "NG",
      category,
      Authorization: `Bearer ${this.config.get('FLUTTERWAVE_SECRET_KEY')}`
    });
  }

  /**
   * Fetch available plans from Flutterwave
   */
  async getPlans(code: string): Promise<any> {
    return flutterwave.getV3BillersBiller_codeItems({
      biller_code: code,
      Authorization: `Bearer ${this.config.get('FLUTTERWAVE_SECRET_KEY')}`
    });
  }

  /**
   * Verify service account e.g meter no, smartcard, etc
   */
  async verifyServiceAccount(code: string, customer: number) {
    return flutterwave.getV3BillItemsCb141Validate({ 
      code, 
      customer,
      Authorization: `Bearer ${this.config.get('FLUTTERWAVE_SECRET_KEY')}`
    });
  }

  /**
   * Pay a bill (core flow)
   */
  async payBill(user: User, walletId: string, dto: BillPaymentDto, reccuring: boolean, duration: number) {
    try {
      const response = await this.paymentsService.payBill(user.id, walletId, dto);

      if(reccuring) this.recurringService.createRecurringPayment({
        userId: response.userId,
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
      })

      return response;
    } catch (err) {
      this.logger.error(`Bill payment failed: ${err.message}`, err.stack);

      throw new BadRequestException(`Bill payment failed: ${err.message}`);
    }
  }
}
