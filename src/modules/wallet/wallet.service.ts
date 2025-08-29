import { Injectable, NotFoundException, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Wallet, WalletType } from './entities/wallet.entity';
import { Transaction, TransactionType, TransactionStatus } from './entities/transaction.entity';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { PaymentsService } from '../payments/payments.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,

    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,

    @InjectQueue('transactions')
    private transactionQueue: Queue,

    private dataSource: DataSource,

    @Inject(forwardRef(() => PaymentsService))
    private paymentsService: PaymentsService,
  ) {}

  async createWallet(userId: string, createWalletDto: CreateWalletDto): Promise<Wallet> {
    const wallet = this.walletRepository.create({
      ...createWalletDto,
      userId,
    });
    return this.walletRepository.save(wallet);
  }

  async findUserWallets(userId: string): Promise<Wallet[]> {
    return this.walletRepository.find({
      where: { userId },
      relations: ['transactions'],
      order: { createdAt: 'DESC' },
    });
  }

  async findWalletById(id: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { id },
      relations: ['user', 'transactions'],
    });
    
    if (!wallet) {
      throw new NotFoundException(`Wallet with ID ${id} not found`);
    }
    
    return wallet;
  }

  async fundAccount(userId: string, withdrawDto: WithdrawDto) {
    const wallet = await this.getUserMainWallet(userId);

    const reference = this.generateReference();

    // Create withdrawal transaction and debit wallet atomically
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create transaction
      const transaction = await queryRunner.manager.save(Transaction, {
        walletId: wallet.id,
        amount: withdrawDto.amount,
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.PROCESSING,
        reference,
        description: 'Wallet Deposit',
        metadata: {
          bankCode: withdrawDto.bankCode,
          accountNumber: withdrawDto.accountNumber,
          accountName: withdrawDto.accountName,
        },
      });

      await queryRunner.commitTransaction();

      // Process withdrawal asynchronously
      await this.transactionQueue.add('process-deposit', {
        transactionId: transaction.id,
        userId,
      });

      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async withdraw(
    userId: string, 
    type: TransactionType.WITHDRAWAL | TransactionType.BILL_PAYMENT | TransactionType.TRANSFER,  
    withdrawDto: WithdrawDto,
    metadata?: any
  ) {
    const wallet = await this.getUserMainWallet(userId);
    
    if (wallet.balance < withdrawDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const reference = this.generateReference();

    // Create withdrawal transaction and debit wallet atomically
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Debit wallet
      await queryRunner.manager.update(Wallet, wallet.id, {
        balance: () => `balance - ${withdrawDto.amount}`,
      });

      // Create transaction
      const transaction = await queryRunner.manager.save(Transaction, {
        walletId: wallet.id,
        amount: withdrawDto.amount,
        type,
        status: TransactionStatus.PROCESSING,
        reference,
        description: `Wallet ${type}`,
        metadata: {
          bankCode: withdrawDto.bankCode,
          accountNumber: withdrawDto.accountNumber,
          accountName: withdrawDto.accountName,
          ...metadata
        },
      });

      await queryRunner.commitTransaction();

      // Process withdrawal asynchronously
      await this.transactionQueue.add('process-withdrawal', {
        transactionId: transaction.id,
        userId,
      });

      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async withdrawComplete(transactionId: string, ref: string, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Reload the transaction from DB to ensure it exists and is current
      const savedTransaction = await queryRunner.manager.findOne(Transaction, {
        where: { id: transactionId },
      });

      if (!savedTransaction) {
        throw new NotFoundException('Transaction not found');
      }

      // Update transaction status
      savedTransaction.status = TransactionStatus.COMPLETED;
      savedTransaction.providerReference = ref;

      await queryRunner.manager.save(savedTransaction);

      await queryRunner.commitTransaction();

      // Optionally queue post-processing if needed
      await this.transactionQueue.add('finalize-withdrawal', {
        transactionId: savedTransaction.id,
        userId,
      });

      return savedTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async withdrawFailed(transactionId: string, reason: string, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Reload the transaction from DB to ensure it exists and is current
      const savedTransaction = await queryRunner.manager.findOne(Transaction, {
        where: { id: transactionId },
      });

      if (!savedTransaction) {
        throw new NotFoundException('Transaction not found');
      }

      // Update transaction status
      savedTransaction.status = TransactionStatus.FAILED;
      savedTransaction.failureReason = reason;

      await queryRunner.manager.save(savedTransaction);

      await queryRunner.commitTransaction();

      // Optionally queue post-processing if needed
      await this.transactionQueue.add('finalize-withdrawal', {
        transactionId: savedTransaction.id,
        userId,
      });

      return savedTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async processWebhook(payload: { tx_ref: string, status: string, transaction_id: string }) {
    const { tx_ref, status, transaction_id } = payload;
    
    const transaction = await this.transactionRepository.findOne({
      where: { id: transaction_id },
      relations: ['wallet'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (status === 'successful' && (
      transaction.status === TransactionStatus.PENDING || 
      transaction.status === TransactionStatus.PROCESSING
    )) {
      // Credit wallet and update transaction
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        await queryRunner.manager.update(Wallet, transaction.walletId, {
          balance: () => `balance + ${transaction.amount}`,
        });

        await queryRunner.manager.update(Transaction, transaction.id, {
          status: TransactionStatus.COMPLETED,
          reference: tx_ref,
          metadata: { ...transaction.metadata, webhookData: payload },
        });

        await queryRunner.commitTransaction();

        // Send notification
        await this.transactionQueue.add('send-notification', {
          userId: transaction.wallet.userId,
          type: 'wallet_funded',
          amount: transaction.amount,
        });

        return { success: true };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    }

    return { success: false };
  }

  async getTransactionHistory(userId: string, page: number = 1, limit: number = 20) {
    const wallets = await this.findUserWallets(userId);
    const walletIds = wallets.map(w => w.id);

    const [transactions, total] = await this.transactionRepository.findAndCount({
      where: { walletId: { $in: walletIds } } as any,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  private async getUserMainWallet(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { userId, type: WalletType.MAIN },
      relations: ['user'],
    });

    if (!wallet) {
      // Create main wallet if it doesn't exist
      // return this.createWallet(userId, { type: WalletType.MAIN, name: "Main Wallet" });
      throw new NotFoundException("User Wallet Not found")
    }

    return wallet;
  }

  private async createTransaction(data: Partial<Transaction>): Promise<Transaction> {
    const transaction = this.transactionRepository.create(data);
    return this.transactionRepository.save(transaction);
  }

  private generateReference(): string {
    return `TXN_${Date.now()}_${uuidv4().substring(0, 8).toUpperCase()}`;
  }
}