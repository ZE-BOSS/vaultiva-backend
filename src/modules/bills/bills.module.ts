import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { Bill } from './entities/bill.entity';
import { BillPayment } from './entities/bill-payment.entity';
import { RecurringPayment } from './entities/recurring-payment.entity';
import { RecurringPaymentsService } from './recurring-payments.service';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bill, BillPayment, RecurringPayment]),
    PaymentsModule,
  ],
  controllers: [BillsController],
  providers: [BillsService, RecurringPaymentsService],
  exports: [BillsService],
})
export class BillsModule {}