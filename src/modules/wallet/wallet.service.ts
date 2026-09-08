import { Injectable, NotFoundException, BadRequestException, forwardRef, Inject, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(WalletService.name);

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

  /**
   * Opens a real bank account for a wallet at Xpress Wallet.
   *
   * Creating the wallet row alone gives the user a balance and nothing else —
   * there is no account number, so no one can pay money in. This is the step
   * that makes it a usable account.
   *
   * Xpress requires a BVN and date of birth, which registration does not
   * collect; they arrive with KYC. Until then the wallet stays unprovisioned and
   * this throws a message saying exactly what is missing, rather than failing
   * somewhere inside the provider call.
   *
   * Safe to call more than once: an already-provisioned wallet is returned as-is.
   */
  async provisionBankAccount(walletId: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { id: walletId },
      relations: ['user'],
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (wallet.providerWalletId) return wallet;

    const user = wallet.user;
    const missing = [
      !user?.bvn && 'bvn',
      !user?.dateOfBirth && 'dateOfBirth',
      !user?.firstName && 'firstName',
      !user?.lastName && 'lastName',
      !user?.phone && 'phone',
    ].filter(Boolean);

    if (missing.length) {
      throw new BadRequestException(
        `Cannot open a bank account until KYC is complete — missing: ${missing.join(', ')}`,
      );
    }

    const { wallet: provider } = await this.paymentsService.createCustomerWallet({
      bvn: user.bvn,
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      phoneNumber: user.phone,
      email: user.email,
      address: user.address,
      metadata: { vaultivaUserId: user.id, vaultivaWalletId: wallet.id },
    });

    wallet.providerWalletId = provider.id;
    wallet.accountNumber = provider.accountNumber;
    wallet.accountName = provider.accountName;
    wallet.bankName = provider.bankName;
    wallet.bankCode = provider.bankCode;

    this.logger.log(`Opened account ${provider.accountNumber} for wallet ${wallet.id}`);
    return this.walletRepository.save(wallet);
  }

  async lockWalletFunds(walletId: string, amount: number, duration: number): Promise<void> {
    const wallet = await this.findWalletById(walletId);
    
    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient balance to lock');
    }

    // Implementation for fund locking
    // This would involve creating a separate locked_funds table or field
    this.logger.log(`Locking ${amount} in wallet ${walletId} for ${duration} days`);
  }

  async findUserWallets(userId: string): Promise<Wallet[]> {
    return this.walletRepository.find({
      where: { userId },
      relations: ['transactions'],
      order: { createdAt: 'DESC' },
    });
  }

  async findUserWalletsByType(userId: string, types: WalletType[]): Promise<Wallet[]> {
    const whereConditions = types.map(type => ({ userId, type }));
    return this.walletRepository.find({
      where: whereConditions,
      relations: ['user'],
    });
  }

  async findUserWalletByType(userId: string, type: WalletType): Promise<Wallet | null> {
    return this.walletRepository.findOne({
      where: { userId, type },
      relations: ['user'],
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

  async transferBetweenWallets(
    fromUserId: string,
    toWalletId: string,
    amount: number,
    description: string,
  ): Promise<Transaction> {
    const fromWallet = await this.getUserMainWallet(fromUserId);
    const toWallet = await this.findWalletById(toWalletId);

    if (fromWallet.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Debit from source wallet
      await queryRunner.manager.update(Wallet, fromWallet.id, {
        balance: () => `balance - ${amount}`,
      });

      // Credit to destination wallet
      await queryRunner.manager.update(Wallet, toWalletId, {
        balance: () => `balance + ${amount}`,
      });

      // Create transaction record
      const transaction = await queryRunner.manager.save(Transaction, {
        walletId: fromWallet.id,
        amount,
        type: TransactionType.TRANSFER,
        status: TransactionStatus.COMPLETED,
        reference: this.generateReference(),
        description,
        metadata: { toWalletId, toUserId: toWallet.userId },
      });

      await queryRunner.commitTransaction();
      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async creditMainWallet(userId: string, amount: number, description: string): Promise<Transaction> {
    const wallet = await this.getUserMainWallet(userId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Credit wallet
      await queryRunner.manager.update(Wallet, wallet.id, {
        balance: () => `balance + ${amount}`,
      });

      // Create transaction record
      const transaction = await queryRunner.manager.save(Transaction, {
        walletId: wallet.id,
        amount,
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.COMPLETED,
        reference: this.generateReference(),
        description,
      });

      await queryRunner.commitTransaction();
      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getTransactionById(transactionId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: ['wallet'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
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

    if (walletIds.length === 0) {
      return {
        transactions: [],
        pagination: { page, limit, total: 0, pages: 0 },
      };
    }

    const whereConditions = walletIds.map(id => ({ walletId: id }));
    const [transactions, total] = await this.transactionRepository.findAndCount({
      where: whereConditions,
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
    });

    if (!wallet) {
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