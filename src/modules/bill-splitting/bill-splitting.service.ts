import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BillSplit, SplitStatus, SplitType, SplitFrequency } from './entities/bill-split.entity';
import { BillSplitParticipant, ParticipantStatus, ParticipantRole } from './entities/bill-split-participant.entity';
import { CreateBillSplitDto } from './dto/create-bill-split.dto';
import { WalletService } from '../wallet/wallet.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType, NotificationChannel } from '../notifications/entities/notification.entity';

@Injectable()
export class BillSplittingService {
  constructor(
    @InjectRepository(BillSplit)
    private billSplitRepository: Repository<BillSplit>,
    @InjectRepository(BillSplitParticipant)
    private participantRepository: Repository<BillSplitParticipant>,
    private walletService: WalletService,
    private notificationsService: NotificationsService,
    private eventEmitter: EventEmitter2,
    private dataSource: DataSource,
  ) {}

  async create(creatorId: string, createBillSplitDto: CreateBillSplitDto): Promise<BillSplit> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create bill split
      const billSplit = queryRunner.manager.create(BillSplit, {
        ...createBillSplitDto,
        creatorId,
        reference: this.generateReference(),
        nextExecutionDate: createBillSplitDto.nextExecutionDate ? 
          new Date(createBillSplitDto.nextExecutionDate) : new Date(),
      });

      const savedBillSplit = await queryRunner.manager.save(billSplit);

      // Create participants
      const participants = createBillSplitDto.participants.map(p => 
        queryRunner.manager.create(BillSplitParticipant, {
          ...p,
          billSplitId: savedBillSplit.id,
        })
      );

      await queryRunner.manager.save(participants);

      await queryRunner.commitTransaction();

      // Send notifications to participants
      for (const participant of createBillSplitDto.participants) {
        await this.notificationsService.create({
          title: 'Bill Split Invitation',
          message: `You've been invited to participate in bill split: ${createBillSplitDto.title}`,
          type: NotificationType.GENERAL,
          channel: NotificationChannel.IN_APP,
          userId: participant.userId,
          metadata: { billSplitId: savedBillSplit.id },
        });
      }

      return savedBillSplit;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findUserBillSplits(userId: string, page: number = 1, limit: number = 20) {
    const [billSplits, total] = await this.billSplitRepository.findAndCount({
      where: [
        { creatorId: userId },
        { participants: { userId } },
      ],
      relations: ['participants', 'participants.user', 'wallet'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      billSplits,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string): Promise<BillSplit> {
    const billSplit = await this.billSplitRepository.findOne({
      where: { id },
      relations: ['participants', 'participants.user', 'participants.wallet', 'wallet', 'creator'],
    });

    if (!billSplit) {
      throw new NotFoundException('Bill split not found');
    }

    // Check if user has access
    const hasAccess = billSplit.creatorId === userId || 
      billSplit.participants.some(p => p.userId === userId);

    if (!hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    return billSplit;
  }

  async executeBillSplit(id: string, userId: string): Promise<BillSplit> {
    const billSplit = await this.findOne(id, userId);

    if (billSplit.status !== SplitStatus.ACTIVE) {
      throw new BadRequestException('Bill split is not active');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (billSplit.type === SplitType.ONE_TO_MANY) {
        await this.executeOneToMany(billSplit, queryRunner);
      } else {
        await this.executeManyToOne(billSplit, queryRunner);
      }

      // Update next execution date for recurring splits
      if (billSplit.frequency === SplitFrequency.RECURRING) {
        const nextDate = this.calculateNextExecutionDate(billSplit);
        await queryRunner.manager.update(BillSplit, id, {
          nextExecutionDate: nextDate,
        });
      } else {
        await queryRunner.manager.update(BillSplit, id, {
          status: SplitStatus.COMPLETED,
        });
      }

      await queryRunner.commitTransaction();

      this.eventEmitter.emit('bill-split.executed', { billSplit });

      return this.findOne(id, userId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async acceptInvitation(id: string, userId: string): Promise<BillSplitParticipant> {
    const participant = await this.participantRepository.findOne({
      where: { billSplitId: id, userId },
      relations: ['billSplit'],
    });

    if (!participant) {
      throw new NotFoundException('Invitation not found');
    }

    if (participant.status !== ParticipantStatus.INVITED) {
      throw new BadRequestException('Invitation already processed');
    }

    participant.status = ParticipantStatus.ACCEPTED;

    // Check if all participants have accepted
    const allParticipants = await this.participantRepository.find({
      where: { billSplitId: id },
    });

    const allAccepted = allParticipants.every(p => 
      p.status === ParticipantStatus.ACCEPTED || p.id === participant.id
    );

    if (allAccepted) {
      await this.billSplitRepository.update(id, {
        status: SplitStatus.ACTIVE,
      });
    }

    return this.participantRepository.save(participant);
  }

  async cancel(id: string, userId: string): Promise<void> {
    const billSplit = await this.findOne(id, userId);

    if (billSplit.creatorId !== userId) {
      throw new ForbiddenException('Only creator can cancel bill split');
    }

    await this.billSplitRepository.update(id, {
      status: SplitStatus.CANCELLED,
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  async processRecurringBillSplits(): Promise<void> {
    const dueBillSplits = await this.billSplitRepository.find({
      where: {
        status: SplitStatus.ACTIVE,
        frequency: SplitFrequency.RECURRING,
        nextExecutionDate: new Date(),
      },
      relations: ['participants'],
    });

    for (const billSplit of dueBillSplits) {
      try {
        await this.executeBillSplit(billSplit.id, billSplit.creatorId);
      } catch (error) {
        console.error(`Failed to execute bill split ${billSplit.id}:`, error);
      }
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendReminders(): Promise<void> {
    const pendingParticipants = await this.participantRepository.find({
      where: {
        status: ParticipantStatus.ACCEPTED,
        role: ParticipantRole.SENDER,
        nextReminderDate: new Date(),
      },
      relations: ['user', 'billSplit'],
    });

    for (const participant of pendingParticipants) {
      await this.notificationsService.create({
        title: 'Bill Split Reminder',
        message: `Reminder: Payment due for "${participant.billSplit.title}"`,
        type: NotificationType.GENERAL,
        channel: NotificationChannel.IN_APP,
        userId: participant.userId,
      });

      // Update next reminder date
      participant.nextReminderDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Next day
      await this.participantRepository.save(participant);
    }
  }

  private async executeOneToMany(billSplit: BillSplit, queryRunner: any): Promise<void> {
    const receivers = billSplit.participants.filter(p => p.role === ParticipantRole.RECEIVER);
    
    for (const receiver of receivers) {
      await this.walletService.transferBetweenWallets(
        billSplit.creatorId,
        receiver.walletId,
        receiver.amount,
        `Bill split: ${billSplit.title}`,
      );
    }
  }

  private async executeManyToOne(billSplit: BillSplit, queryRunner: any): Promise<void> {
    const senders = billSplit.participants.filter(p => p.role === ParticipantRole.SENDER);
    const receiver = billSplit.participants.find(p => p.role === ParticipantRole.RECEIVER);

    if (!receiver) {
      throw new BadRequestException('No receiver found for many-to-one split');
    }

    for (const sender of senders) {
      await this.walletService.transferBetweenWallets(
        sender.userId,
        receiver.walletId,
        sender.amount,
        `Bill split contribution: ${billSplit.title}`,
      );
    }
  }

  private calculateNextExecutionDate(billSplit: BillSplit): Date {
    const current = billSplit.nextExecutionDate || new Date();
    const next = new Date(current);

    if (billSplit.schedule?.frequency === 'daily') {
      next.setDate(next.getDate() + 1);
    } else if (billSplit.schedule?.frequency === 'weekly') {
      next.setDate(next.getDate() + 7);
    } else if (billSplit.schedule?.frequency === 'monthly') {
      next.setMonth(next.getMonth() + 1);
    }

    return next;
  }

  private generateReference(): string {
    return `SPLIT_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
}