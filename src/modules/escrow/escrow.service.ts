import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Escrow, EscrowStatus, EscrowType } from './entities/escrow.entity';
import { EscrowParticipant, ParticipantStatus, ParticipantRole } from './entities/escrow-participant.entity';
import { CreateEscrowDto } from './dto/create-escrow.dto';
import { UpdateEscrowDto } from './dto/update-escrow.dto';
import { WalletService } from '../wallet/wallet.service';
import { WalletType } from '../wallet/entities/wallet.entity';
import { TransactionType } from '../wallet/entities/transaction.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType, NotificationChannel } from '../notifications/entities/notification.entity';

@Injectable()
export class EscrowService {
  constructor(
    @InjectRepository(Escrow)
    private escrowRepository: Repository<Escrow>,
    @InjectRepository(EscrowParticipant)
    private participantRepository: Repository<EscrowParticipant>,
    private walletService: WalletService,
    private notificationsService: NotificationsService,
    private eventEmitter: EventEmitter2,
    private dataSource: DataSource,
  ) {}

  async create(creatorId: string, createEscrowDto: CreateEscrowDto): Promise<Escrow> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get user's escrow wallet
      const escrowWallet = await this.walletService.findUserWalletByType(creatorId, WalletType.ESCROW);
      if (!escrowWallet) {
        throw new NotFoundException('Escrow wallet not found');
      }

      // Create escrow
      const escrow = queryRunner.manager.create(Escrow, {
        ...createEscrowDto,
        creatorId,
        walletId: escrowWallet.id,
        reference: this.generateReference(),
        releaseDate: new Date(createEscrowDto.releaseDate),
      });

      const savedEscrow = await queryRunner.manager.save(escrow);

      // Create participants
      const participants = createEscrowDto.participants.map(p => 
        queryRunner.manager.create(EscrowParticipant, {
          ...p,
          escrowId: savedEscrow.id,
        })
      );

      await queryRunner.manager.save(participants);

      await queryRunner.commitTransaction();

      // Send notifications to participants
      for (const participant of createEscrowDto.participants) {
        await this.notificationsService.create({
          title: 'Escrow Invitation',
          message: `You've been invited to participate in escrow: ${createEscrowDto.title}`,
          type: NotificationType.GENERAL,
          channel: NotificationChannel.IN_APP,
          userId: participant.userId,
          metadata: { escrowId: savedEscrow.id },
        });
      }

      return savedEscrow;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findUserEscrows(userId: string, page: number = 1, limit: number = 20) {
    const whereConditions = [
      { creatorId: userId },
      { participants: { userId } },
    ];

    const [escrows, total] = await this.escrowRepository.findAndCount({
      where: whereConditions,
      relations: ['participants', 'participants.user', 'wallet'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      escrows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string): Promise<Escrow> {
    const escrow = await this.escrowRepository.findOne({
      where: { id },
      relations: ['participants', 'participants.user', 'wallet', 'creator'],
    });

    if (!escrow) {
      throw new NotFoundException('Escrow not found');
    }

    // Check if user has access to this escrow
    const hasAccess = escrow.creatorId === userId || 
      escrow.participants.some(p => p.userId === userId);

    if (!hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    return escrow;
  }

  async update(id: string, updateEscrowDto: UpdateEscrowDto, userId: string): Promise<Escrow> {
    const escrow = await this.findOne(id, userId);

    if (escrow.creatorId !== userId) {
      throw new ForbiddenException('Only creator can update escrow');
    }

    if (escrow.status !== EscrowStatus.PENDING) {
      throw new BadRequestException('Cannot update escrow that is not pending');
    }

    await this.escrowRepository.update(id, updateEscrowDto);
    return this.findOne(id, userId);
  }

  async fundEscrow(id: string, userId: string): Promise<Escrow> {
    const escrow = await this.findOne(id, userId);

    if (escrow.status !== EscrowStatus.PENDING) {
      throw new BadRequestException('Escrow is not in pending status');
    }

    const participant = escrow.participants.find(p => p.userId === userId && p.role === ParticipantRole.PAYER);
    if (!participant) {
      throw new ForbiddenException('User is not authorized to fund this escrow');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Transfer funds from user's main wallet to escrow wallet
      await this.walletService.transferBetweenWallets(
        userId,
        escrow.walletId,
        escrow.amount,
        `Escrow funding: ${escrow.title}`,
      );

      // Update escrow status
      await queryRunner.manager.update(Escrow, id, {
        status: EscrowStatus.FUNDED,
      });

      await queryRunner.commitTransaction();

      // Notify all participants
      for (const p of escrow.participants) {
        await this.notificationsService.create({
          title: 'Escrow Funded',
          message: `Escrow "${escrow.title}" has been funded`,
          type: NotificationType.GENERAL,
          channel: NotificationChannel.IN_APP,
          userId: p.userId,
        });
      }

      return this.findOne(id, userId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async releaseEscrow(id: string, userId: string): Promise<Escrow> {
    const escrow = await this.findOne(id, userId);

    if (escrow.status !== EscrowStatus.FUNDED) {
      throw new BadRequestException('Escrow must be funded before release');
    }

    // Check if release conditions are met
    if (new Date() < escrow.releaseDate) {
      throw new BadRequestException('Release date has not been reached');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Find payee participants
      const payees = escrow.participants.filter(p => p.role === ParticipantRole.PAYEE);
      
      // Distribute funds to payees
      for (const payee of payees) {
        const payeeWallet = await this.walletService.findUserWalletByType(payee.userId, WalletType.MAIN);
        if (payeeWallet) {
          await this.walletService.transferBetweenWallets(
            escrow.creatorId,
            payeeWallet.id,
            payee.contributionAmount || escrow.amount / payees.length,
            `Escrow release: ${escrow.title}`,
          );
        }
      }

      // Update escrow status
      await queryRunner.manager.update(Escrow, id, {
        status: EscrowStatus.RELEASED,
      });

      await queryRunner.commitTransaction();

      this.eventEmitter.emit('escrow.released', { escrow });

      return this.findOne(id, userId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async disputeEscrow(id: string, reason: string, userId: string): Promise<Escrow> {
    const escrow = await this.findOne(id, userId);

    if (escrow.status !== EscrowStatus.FUNDED) {
      throw new BadRequestException('Can only dispute funded escrows');
    }

    await this.escrowRepository.update(id, {
      status: EscrowStatus.DISPUTED,
      metadata: { ...escrow.metadata, disputeReason: reason, disputedBy: userId },
    });

    // Notify all participants about dispute
    for (const participant of escrow.participants) {
      await this.notificationsService.create({
        title: 'Escrow Disputed',
        message: `Escrow "${escrow.title}" has been disputed`,
        type: NotificationType.SECURITY,
        channel: NotificationChannel.IN_APP,
        userId: participant.userId,
      });
    }

    return this.findOne(id, userId);
  }

  async acceptInvitation(id: string, userId: string): Promise<EscrowParticipant> {
    const participant = await this.participantRepository.findOne({
      where: { escrowId: id, userId },
      relations: ['escrow'],
    });

    if (!participant) {
      throw new NotFoundException('Invitation not found');
    }

    if (participant.status !== ParticipantStatus.INVITED) {
      throw new BadRequestException('Invitation already processed');
    }

    participant.status = ParticipantStatus.ACCEPTED;
    participant.acceptedAt = new Date();

    return this.participantRepository.save(participant);
  }

  async cancel(id: string, userId: string): Promise<void> {
    const escrow = await this.findOne(id, userId);

    if (escrow.creatorId !== userId) {
      throw new ForbiddenException('Only creator can cancel escrow');
    }

    if (escrow.status === EscrowStatus.FUNDED) {
      throw new BadRequestException('Cannot cancel funded escrow');
    }

    await this.escrowRepository.update(id, {
      status: EscrowStatus.CANCELLED,
    });
  }

  private generateReference(): string {
    return `ESC_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
}