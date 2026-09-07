import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LedgerService } from './ledger.service';
import { LedgerController } from './ledger.controller';
import { LedgerEntry } from './entities/ledger-entry.entity';
import { ReconciliationRecord } from './entities/reconciliation-record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LedgerEntry, ReconciliationRecord]),
  ],
  controllers: [LedgerController],
  providers: [LedgerService],
  exports: [LedgerService],
})
export class LedgerModule {}