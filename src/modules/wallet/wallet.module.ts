import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { PaymentsModule } from '@/modules/payments/payments.module';
import { NotificationsModule } from '@/modules/notifications/notifications.module';
import { TransactionProcessor } from './processors/transaction.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, Transaction]),
    BullModule.registerQueue({
      name: 'transactions',
    }),
    forwardRef(() => PaymentsModule),
    NotificationsModule,
  ],
  controllers: [WalletController],
  providers: [WalletService, TransactionProcessor],
  exports: [WalletService],
})
export class WalletModule {}