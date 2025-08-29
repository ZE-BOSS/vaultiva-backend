import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { RecurringPayment, RecurrenceFrequency, RecurringStatus } from './entities/recurring-payment.entity';
import { TransactionType } from '../wallet/entities/transaction.entity';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class RecurringPaymentsService {
  constructor(
    @InjectRepository(RecurringPayment)
    private readonly recurringRepo: Repository<RecurringPayment>,
    private readonly paymentSerice: PaymentsService,
  ) {}

  async createRecurringPayment(data: Partial<RecurringPayment>): Promise<RecurringPayment> {
    const recurring = this.recurringRepo.create({
        ...data,
        startDate: this.calculateNextRun(data.frequency, new Date(), data.duration),
    });
    return this.recurringRepo.save(recurring);
  }

  async pauseRecurringPayment(id: string): Promise<RecurringPayment> {
    const recurring = await this.recurringRepo.findOne({ where: { id } });
    if (!recurring) throw new NotFoundException('Recurring payment not found');
    recurring.status = RecurringStatus.PAUSED;
    return this.recurringRepo.save(recurring);
  }

  async cancelRecurringPayment(id: string): Promise<RecurringPayment> {
    const recurring = await this.recurringRepo.findOne({ where: { id } });
    if (!recurring) throw new NotFoundException('Recurring payment not found');
    recurring.status = RecurringStatus.CANCELLED;
    return this.recurringRepo.save(recurring);
  }

  async resumeRecurringPayment(id: string): Promise<RecurringPayment> {
    const recurring = await this.recurringRepo.findOne({ where: { id } });
    if (!recurring) throw new NotFoundException('Recurring payment not found');
    recurring.status = RecurringStatus.ACTIVE;
    return this.recurringRepo.save(recurring);
  }

  async listRecurring(userId: string, type: TransactionType) {
    return this.recurringRepo.find({ where: { userId, status: RecurringStatus.ACTIVE, transaction: { type }} });
  }

  async processDuePayments(today: Date = new Date()): Promise<void> {
    const duePayments = await this.recurringRepo.find({
        where: {
            status: RecurringStatus.ACTIVE,
            startDate: LessThanOrEqual(today),
        },
        relations: ['bill', 'user', 'transaction', 'transaction.wallet'],
    });

    for (const recurring of duePayments) {
        const shouldProcess = this.shouldProcess(recurring, today);
        if (!shouldProcess) continue;

        // Run the payment
        if (recurring.transaction.type === TransactionType.BILL_PAYMENT) {
            await this.paymentSerice.payBill(
                recurring.user.id,
                recurring.transaction.wallet.id,
                {
                    amount: recurring.transaction.amount,
                    customer: recurring.transaction.metadata.customer,
                    biller_code: recurring.transaction.metadata.biller_code,
                    item_code: recurring.transaction.metadata.item_code,
                    type: recurring.transaction.metadata.type,
                    country: 'NG',
                },
            );
        }

        if (recurring.transaction.type === TransactionType.WITHDRAWAL) {

        }

        // Move startDate forward for the next cycle
        recurring.startDate = this.calculateNextRun(recurring.frequency, recurring.startDate, recurring.duration);
        await this.recurringRepo.save(recurring);
    }
  }


  private shouldProcess(recurring: RecurringPayment, today: Date): boolean {
    const start = new Date(recurring.startDate);

    // calculate days elapsed since start
    const elapsedDays = Math.floor(
        (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    // stop if duration exceeded
    if (recurring.duration && elapsedDays >= recurring.duration) {
        return false;
    }

    switch (recurring.frequency) {
        case RecurrenceFrequency.DAILY:
            return true;
        case RecurrenceFrequency.WEEKLY:
            return today.getDay() === start.getDay();
        case RecurrenceFrequency.MONTHLY:
            return today.getDate() === start.getDate();
        case RecurrenceFrequency.CUSTOM:
            return (elapsedDays % recurring.duration) === 0;
        default:
            return false;
    }
  }

  private calculateNextRun(frequency: RecurrenceFrequency, from: Date = new Date(), duration: number): Date {
    const next = new Date(from);

    switch (frequency) {
        case RecurrenceFrequency.DAILY:
            next.setDate(next.getDate() + 1);
            break;
        case RecurrenceFrequency.WEEKLY:
            next.setDate(next.getDate() + 7);
            break;
        case RecurrenceFrequency.MONTHLY:
            next.setMonth(next.getMonth() + 1);
            break;
        case RecurrenceFrequency.CUSTOM:
            next.setDate(next.getDate() + duration);
            break;
    }

    return next;
  }
}
