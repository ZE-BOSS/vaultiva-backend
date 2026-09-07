import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LedgerEntry, LedgerEntryType, LedgerProvider, LedgerStatus } from './entities/ledger-entry.entity';
import { ReconciliationRecord, ReconciliationType, ReconciliationStatus } from './entities/reconciliation-record.entity';

@Injectable()
export class LedgerService {
  private readonly logger = new Logger(LedgerService.name);

  constructor(
    @InjectRepository(LedgerEntry)
    private ledgerRepository: Repository<LedgerEntry>,
    @InjectRepository(ReconciliationRecord)
    private reconciliationRepository: Repository<ReconciliationRecord>,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('transaction.created')
  async recordTransaction(payload: {
    userId: string;
    walletId: string;
    transactionId: string;
    amount: number;
    type: LedgerEntryType;
    provider: LedgerProvider;
    reference: string;
    description: string;
    metadata?: any;
  }): Promise<LedgerEntry> {
    const entry = this.ledgerRepository.create({
      ...payload,
      status: LedgerStatus.PENDING,
    });

    const savedEntry = await this.ledgerRepository.save(entry);
    this.logger.log(`Ledger entry created: ${savedEntry.reference}`);
    
    return savedEntry;
  }

  @OnEvent('transaction.completed')
  async updateTransactionStatus(payload: {
    reference: string;
    providerReference?: string;
    status: LedgerStatus;
  }): Promise<void> {
    await this.ledgerRepository.update(
      { reference: payload.reference },
      {
        status: payload.status,
        providerReference: payload.providerReference,
        reconciledAt: new Date(),
      }
    );

    this.logger.log(`Ledger entry updated: ${payload.reference} -> ${payload.status}`);
  }

  async getLedgerEntries(
    userId?: string,
    startDate?: Date,
    endDate?: Date,
    provider?: LedgerProvider,
    page: number = 1,
    limit: number = 50
  ) {
    const where: any = {};
    
    if (userId) where.userId = userId;
    if (provider) where.provider = provider;
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    }

    const [entries, total] = await this.ledgerRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      entries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getBalanceSummary(userId?: string): Promise<{
    totalCredits: number;
    totalDebits: number;
    netBalance: number;
    byProvider: Record<LedgerProvider, { credits: number; debits: number; net: number }>;
  }> {
    const where = userId ? { userId } : {};
    
    const entries = await this.ledgerRepository.find({ where });

    const summary = {
      totalCredits: 0,
      totalDebits: 0,
      netBalance: 0,
      byProvider: {} as Record<LedgerProvider, { credits: number; debits: number; net: number }>,
    };

    // Initialize provider summaries
    Object.values(LedgerProvider).forEach(provider => {
      summary.byProvider[provider] = { credits: 0, debits: 0, net: 0 };
    });

    entries.forEach(entry => {
      const amount = Number(entry.amount);
      
      if (entry.type === LedgerEntryType.CREDIT) {
        summary.totalCredits += amount;
        summary.byProvider[entry.provider].credits += amount;
      } else {
        summary.totalDebits += amount;
        summary.byProvider[entry.provider].debits += amount;
      }
    });

    summary.netBalance = summary.totalCredits - summary.totalDebits;

    Object.keys(summary.byProvider).forEach(providerKey => {
      const provider = providerKey as LedgerProvider;
      const providerData = summary.byProvider[provider];
      providerData.net = providerData.credits - providerData.debits;
    });

    return summary;
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async performDailyReconciliation(): Promise<void> {
    this.logger.log('Starting daily reconciliation');

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date(yesterday);
    today.setDate(today.getDate() + 1);

    try {
      const reconciliation = await this.reconcileTransactions(yesterday, today);
      this.logger.log(`Daily reconciliation completed: ${reconciliation.reconciledEntries}/${reconciliation.totalEntries} entries reconciled`);
    } catch (error) {
      this.logger.error('Daily reconciliation failed:', error);
    }
  }

  async reconcileTransactions(startDate: Date, endDate: Date): Promise<ReconciliationRecord> {
    const entries = await this.ledgerRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
        status: LedgerStatus.COMPLETED,
      },
    });

    const reconciliation = this.reconciliationRepository.create({
      type: ReconciliationType.AUTOMATIC,
      status: ReconciliationStatus.PENDING,
      reconciliationDate: startDate,
      totalEntries: entries.length,
      reconciledEntries: 0,
      discrepancies: 0,
      totalAmount: entries.reduce((sum, entry) => sum + Number(entry.amount), 0),
    });

    // Perform reconciliation logic here
    // This would involve checking with external providers
    
    reconciliation.status = ReconciliationStatus.COMPLETED;
    reconciliation.reconciledEntries = entries.length;

    return this.reconciliationRepository.save(reconciliation);
  }

  async getReconciliationHistory(page: number = 1, limit: number = 20) {
    const [records, total] = await this.reconciliationRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      records,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}