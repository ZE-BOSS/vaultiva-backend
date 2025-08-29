import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, LessThanOrEqual } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Transfer, TransferType, TransferStatus } from './entities/transfer.entity';
import { ScheduledTransfer, ScheduleStatus, ScheduleFrequency } from './entities/scheduled-transfer.entity';
import { BankDowntime, DowntimeStatus } from './entities/bank-downtime.entity';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { CreateScheduledTransferDto } from './dto/create-scheduled-transfer.dto';
import { WalletService } from '../wallet/wallet.service';
import { NotificationsService } from '../notifications/notifications.service';
import { LedgerService } from '../ledger/ledger.service';
import { LedgerEntryType, LedgerProvider } from '../ledger/entities/ledger-entry.entity';

@Injectable()
export class TransfersService {
  private readonly logger = new Logger(TransfersService.name);

  constructor(
    @InjectRepository(Transfer)
    private transferRepository: Repository<Transfer>,
    @InjectRepository(ScheduledTransfer)
    private scheduledTransferRepository: Repository<ScheduledTransfer>,
    @InjectRepository(BankDowntime)
    private bankDowntimeRepository: Repository<BankDowntime>,
    @InjectQueue('transfers')
    private transferQueue: Queue,
    private walletService: WalletService,
    private notificationsService: NotificationsService,
    private ledgerService: LedgerService,
    private eventEmitter: EventEmitter2,
    private dataSource: DataSource,
  ) {}

  async createTransfer(userId: string, createTransferDto: CreateTransferDto): Promise<Transfer> {
    // Check for bank downtime if transferring to bank
    if (createTransferDto.type === TransferType.WALLET_TO_BANK) {
      const downtime = await this.checkBankDowntime(createTransferDto.destinationDetails.bankCode);
      if (downtime) {
        throw new BadRequestException(`Bank is currently experiencing downtime: ${downtime.description}`);
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transfer = queryRunner.manager.create(Transfer, {
        ...createTransferDto,
        userId,
        reference: this.generateReference(),
        status: TransferStatus.PENDING,
      });

      const savedTransfer = await queryRunner.manager.save(transfer);

      // Record in ledger
      await this.ledgerService.recordTransaction({
        userId,
        walletId: createTransferDto.sourceWalletId,
        transactionId: savedTransfer.id,
        amount: createTransferDto.amount,
        type: LedgerEntryType.DEBIT,
        provider: LedgerProvider.INTERNAL,
        reference: savedTransfer.reference,
        description: createTransferDto.description,
        metadata: createTransferDto.metadata,
      });

      await queryRunner.commitTransaction();

      // Queue transfer for processing
      await this.transferQueue.add('process-transfer', {
        transferId: savedTransfer.id,
      });

      return savedTransfer;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createScheduledTransfer(
    userId: string,
    createScheduledTransferDto: CreateScheduledTransferDto
  ): Promise<ScheduledTransfer> {
    const scheduledTransfer = this.scheduledTransferRepository.create({
      ...createScheduledTransferDto,
      userId,
      nextExecutionDate: new Date(createScheduledTransferDto.nextExecutionDate),
      endDate: createScheduledTransferDto.endDate ? 
        new Date(createScheduledTransferDto.endDate) : null,
    });

    return this.scheduledTransferRepository.save(scheduledTransfer);
  }

  async getUserTransfers(userId: string, page: number = 1, limit: number = 20) {
    const [transfers, total] = await this.transferRepository.findAndCount({
      where: { userId },
      relations: ['sourceWallet', 'destinationWallet'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      transfers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getScheduledTransfers(userId: string): Promise<ScheduledTransfer[]> {
    return this.scheduledTransferRepository.find({
      where: { userId, status: ScheduleStatus.ACTIVE },
      order: { nextExecutionDate: 'ASC' },
    });
  }

  async pauseScheduledTransfer(id: string, userId: string): Promise<ScheduledTransfer> {
    const transfer = await this.scheduledTransferRepository.findOne({
      where: { id, userId },
    });

    if (!transfer) {
      throw new NotFoundException('Scheduled transfer not found');
    }

    transfer.status = ScheduleStatus.PAUSED;
    return this.scheduledTransferRepository.save(transfer);
  }

  async resumeScheduledTransfer(id: string, userId: string): Promise<ScheduledTransfer> {
    const transfer = await this.scheduledTransferRepository.findOne({
      where: { id, userId },
    });

    if (!transfer) {
      throw new NotFoundException('Scheduled transfer not found');
    }

    transfer.status = ScheduleStatus.ACTIVE;
    return this.scheduledTransferRepository.save(transfer);
  }

  async cancelScheduledTransfer(id: string, userId: string): Promise<void> {
    const result = await this.scheduledTransferRepository.update(
      { id, userId },
      { status: ScheduleStatus.CANCELLED }
    );

    if (result.affected === 0) {
      throw new NotFoundException('Scheduled transfer not found');
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async processScheduledTransfers(): Promise<void> {
    const dueTransfers = await this.scheduledTransferRepository.find({
      where: {
        status: ScheduleStatus.ACTIVE,
        nextExecutionDate: LessThanOrEqual(new Date()),
      },
    });

    for (const scheduledTransfer of dueTransfers) {
      try {
        await this.executeScheduledTransfer(scheduledTransfer);
      } catch (error) {
        this.logger.error(`Failed to execute scheduled transfer ${scheduledTransfer.id}:`, error);
      }
    }
  }

  async checkBankDowntime(bankCode: string): Promise<BankDowntime | null> {
    return this.bankDowntimeRepository.findOne({
      where: {
        bankCode,
        status: DowntimeStatus.ACTIVE,
      },
    });
  }

  async getBankDowntimes(): Promise<BankDowntime[]> {
    return this.bankDowntimeRepository.find({
      where: { status: DowntimeStatus.ACTIVE },
      order: { startTime: 'DESC' },
    });
  }

  private async executeScheduledTransfer(scheduledTransfer: ScheduledTransfer): Promise<void> {
    const transferData = scheduledTransfer.transferTemplate;
    
    try {
      await this.createTransfer(scheduledTransfer.userId, transferData);
      
      // Update execution count and next execution date
      scheduledTransfer.executionCount += 1;
      scheduledTransfer.nextExecutionDate = this.calculateNextExecutionDate(scheduledTransfer);

      // Check if max executions reached
      if (scheduledTransfer.maxExecutions && 
          scheduledTransfer.executionCount >= scheduledTransfer.maxExecutions) {
        scheduledTransfer.status = ScheduleStatus.COMPLETED;
      }

      await this.scheduledTransferRepository.save(scheduledTransfer);
    } catch (error) {
      this.logger.error(`Scheduled transfer execution failed:`, error);
      
      // Notify user of failure
      await this.notificationsService.create({
        title: 'Scheduled Transfer Failed',
        message: `Your scheduled transfer "${scheduledTransfer.name}" failed to execute`,
        type: 'GENERAL' as any,
        channel: 'IN_APP' as any,
        userId: scheduledTransfer.userId,
      });
    }
  }

  private calculateNextExecutionDate(scheduledTransfer: ScheduledTransfer): Date {
    const current = scheduledTransfer.nextExecutionDate;
    const next = new Date(current);

    switch (scheduledTransfer.frequency) {
      case ScheduleFrequency.DAILY:
        next.setDate(next.getDate() + 1);
        break;
      case ScheduleFrequency.WEEKLY:
        next.setDate(next.getDate() + 7);
        break;
      case ScheduleFrequency.MONTHLY:
        next.setMonth(next.getMonth() + 1);
        break;
    }

    return next;
  }

  private generateReference(): string {
    return `TRF_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
}