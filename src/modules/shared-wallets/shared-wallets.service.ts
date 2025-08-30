import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SharedWallet, SharedWalletMode, SharedWalletStatus } from './entities/shared-wallet.entity';
import { SharedWalletMember, MemberRole, MemberStatus } from './entities/shared-wallet-member.entity';
import { SharedWalletTransaction, SharedTransactionStatus } from './entities/shared-wallet-transaction.entity';
import { TransactionSignature, SignatureStatus } from './entities/transaction-signature.entity';
import { CreateSharedWalletDto } from './dto/create-shared-wallet.dto';
import { CreateSharedWalletTransactionDto } from './dto/create-transaction.dto';
import { WalletService } from '../wallet/wallet.service';
import { WalletType } from '../wallet/entities/wallet.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType, NotificationChannel } from '../notifications/entities/notification.entity';

@Injectable()
export class SharedWalletsService {
  constructor(
    @InjectRepository(SharedWallet)
    private sharedWalletRepository: Repository<SharedWallet>,
    @InjectRepository(SharedWalletMember)
    private memberRepository: Repository<SharedWalletMember>,
    @InjectRepository(SharedWalletTransaction)
    private transactionRepository: Repository<SharedWalletTransaction>,
    @InjectRepository(TransactionSignature)
    private signatureRepository: Repository<TransactionSignature>,
    private walletService: WalletService,
    private notificationsService: NotificationsService,
    private eventEmitter: EventEmitter2,
    private dataSource: DataSource,
  ) {}

  async create(creatorId: string, createSharedWalletDto: CreateSharedWalletDto): Promise<SharedWallet> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create underlying wallet
      const wallet = await this.walletService.createWallet(creatorId, {
        type: WalletType.OTHERS,
        name: createSharedWalletDto.name,
        customerId: '', // Will be set by wallet service
      });

      // Create shared wallet
      const sharedWallet = queryRunner.manager.create(SharedWallet, {
        ...createSharedWalletDto,
        creatorId,
        walletId: wallet.id,
      });

      const savedSharedWallet = await queryRunner.manager.save(sharedWallet);

      // Add creator as admin member
      const creatorMember = queryRunner.manager.create(SharedWalletMember, {
        userId: creatorId,
        sharedWalletId: savedSharedWallet.id,
        role: MemberRole.ADMIN,
        status: MemberStatus.ACTIVE,
        joinedAt: new Date(),
      });

      await queryRunner.manager.save(creatorMember);

      // Add other members
      const members = createSharedWalletDto.members.map(m => 
        queryRunner.manager.create(SharedWalletMember, {
          ...m,
          sharedWalletId: savedSharedWallet.id,
        })
      );

      await queryRunner.manager.save(members);

      await queryRunner.commitTransaction();

      // Send invitations to members
      for (const member of createSharedWalletDto.members) {
        await this.notificationsService.create({
          title: 'Shared Wallet Invitation',
          message: `You've been invited to join shared wallet: ${createSharedWalletDto.name}`,
          type: NotificationType.GENERAL,
          channel: NotificationChannel.IN_APP,
          userId: member.userId,
          metadata: { sharedWalletId: savedSharedWallet.id },
        });
      }

      return savedSharedWallet;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findUserSharedWallets(userId: string, page: number = 1, limit: number = 20) {
    const [sharedWallets, total] = await this.sharedWalletRepository.findAndCount({
      where: [
        { creatorId: userId },
        { members: { userId } },
      ],
      relations: ['members', 'members.user', 'wallet'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      sharedWallets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async initiateTransaction(
    sharedWalletId: string,
    initiatorId: string,
    createTransactionDto: CreateSharedWalletTransactionDto,
  ): Promise<SharedWalletTransaction> {
    const sharedWallet = await this.findOne(sharedWalletId, initiatorId);
    
    // Check if user is a member
    const member = sharedWallet.members.find(m => m.userId === initiatorId);
    if (!member || member.status !== MemberStatus.ACTIVE) {
      throw new ForbiddenException('User is not an active member of this shared wallet');
    }

    // Check spending limit
    if (member.spendingLimit && createTransactionDto.amount > member.spendingLimit) {
      throw new BadRequestException('Transaction amount exceeds spending limit');
    }

    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      initiatorId,
      sharedWalletId,
      reference: this.generateReference(),
      status: sharedWallet.mode === SharedWalletMode.FREE_ACTION ? 
        SharedTransactionStatus.APPROVED : SharedTransactionStatus.PENDING,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    if (sharedWallet.mode === SharedWalletMode.SIGNATORY_REQUIRED) {
      // Create signature requests for required signatories
      const signatories = sharedWallet.members.filter(m => 
        m.role === MemberRole.ADMIN && m.userId !== initiatorId
      );

      const signatures = signatories.map(s => 
        this.signatureRepository.create({
          signerId: s.userId,
          transactionId: savedTransaction.id,
        })
      );

      await this.signatureRepository.save(signatures);

      // Notify signatories
      for (const signatory of signatories) {
        await this.notificationsService.create({
          title: 'Transaction Approval Required',
          message: `Transaction approval required for shared wallet: ${sharedWallet.name}`,
          type: NotificationType.GENERAL,
          channel: NotificationChannel.IN_APP,
          userId: signatory.userId,
        });
      }
    } else {
      // Execute transaction immediately for free action mode
      await this.executeTransaction(savedTransaction.id);
    }

    return savedTransaction;
  }

  async signTransaction(
    transactionId: string,
    signerId: string,
    approved: boolean,
    comment?: string,
  ): Promise<TransactionSignature> {
    const signature = await this.signatureRepository.findOne({
      where: { transactionId, signerId },
      relations: ['transaction', 'transaction.sharedWallet'],
    });

    if (!signature) {
      throw new NotFoundException('Signature request not found');
    }

    signature.status = approved ? SignatureStatus.APPROVED : SignatureStatus.REJECTED;
    signature.comment = comment;

    const savedSignature = await this.signatureRepository.save(signature);

    // Check if enough signatures collected
    if (approved) {
      const allSignatures = await this.signatureRepository.find({
        where: { transactionId },
      });

      const approvedCount = allSignatures.filter(s => s.status === SignatureStatus.APPROVED).length;
      const requiredSignatures = signature.transaction.sharedWallet.requiredSignatures;

      if (approvedCount >= requiredSignatures) {
        await this.executeTransaction(transactionId);
      }
    } else {
      // Reject transaction if any signature is rejected
      await this.transactionRepository.update(transactionId, {
        status: SharedTransactionStatus.REJECTED,
      });
    }

    return savedSignature;
  }

  private async executeTransaction(transactionId: string): Promise<void> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: ['sharedWallet', 'sharedWallet.wallet'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    // Execute the actual wallet operation
    // This would integrate with the wallet service to perform the transaction
    
    await this.transactionRepository.update(transactionId, {
      status: SharedTransactionStatus.EXECUTED,
    });
  }

  private async findOne(id: string, userId: string): Promise<SharedWallet> {
    const sharedWallet = await this.sharedWalletRepository.findOne({
      where: { id },
      relations: ['members', 'members.user', 'wallet', 'creator'],
    });

    if (!sharedWallet) {
      throw new NotFoundException('Shared wallet not found');
    }

    // Check if user has access
    const hasAccess = sharedWallet.creatorId === userId || 
      sharedWallet.members.some(m => m.userId === userId);

    if (!hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    return sharedWallet;
  }

  private generateReference(): string {
    return `SHARED_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
}