import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { Transfer } from './entities/transfer.entity';
import { ScheduledTransfer } from './entities/scheduled-transfer.entity';
import { BankDowntime } from './entities/bank-downtime.entity';
import { WalletModule } from '../wallet/wallet.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { LedgerModule } from '../ledger/ledger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transfer, ScheduledTransfer, BankDowntime]),
    BullModule.registerQueue({
      name: 'transfers',
    }),
    WalletModule,
    NotificationsModule,
    LedgerModule,
  ],
  controllers: [TransfersController],
  providers: [TransfersService],
  exports: [TransfersService],
})
export class TransfersModule {}