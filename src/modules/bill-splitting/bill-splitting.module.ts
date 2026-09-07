import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillSplittingService } from './bill-splitting.service';
import { BillSplittingController } from './bill-splitting.controller';
import { BillSplit } from './entities/bill-split.entity';
import { BillSplitParticipant } from './entities/bill-split-participant.entity';
import { WalletModule } from '../wallet/wallet.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BillSplit, BillSplitParticipant]),
    WalletModule,
    NotificationsModule,
  ],
  controllers: [BillSplittingController],
  providers: [BillSplittingService],
  exports: [BillSplittingService],
})
export class BillSplittingModule {}