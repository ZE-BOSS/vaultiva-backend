import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { getQueueToken } from '@nestjs/bullmq';
import { WalletService } from './wallet.service';
import { Wallet, WalletType } from './entities/wallet.entity';
import { Transaction, TransactionType, TransactionStatus } from './entities/transaction.entity';
import { PaymentsService } from '../payments/payments.service';

describe('WalletService', () => {
  let service: WalletService;
  let walletRepository: jest.Mocked<Repository<Wallet>>;
  let transactionRepository: jest.Mocked<Repository<Transaction>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: getRepositoryToken(Wallet),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
        {
          provide: getQueueToken('transactions'),
          useValue: {
            add: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn(() => ({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
              manager: {
                save: jest.fn(),
                update: jest.fn(),
                findOne: jest.fn(),
              },
            })),
          },
        },
        {
          provide: PaymentsService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    walletRepository = module.get(getRepositoryToken(Wallet));
    transactionRepository = module.get(getRepositoryToken(Transaction));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createWallet', () => {
    it('should create a new wallet', async () => {
      const createWalletDto = {
        name: 'Test Wallet',
        type: WalletType.MAIN,
        customerId: 'test-customer',
      };

      const mockWallet = { id: '1', ...createWalletDto };
      walletRepository.create.mockReturnValue(mockWallet as any);
      walletRepository.save.mockResolvedValue(mockWallet as any);

      const result = await service.createWallet('user-id', createWalletDto);

      expect(walletRepository.create).toHaveBeenCalledWith({
        ...createWalletDto,
        userId: 'user-id',
      });
      expect(result).toEqual(mockWallet);
    });
  });

  describe('findUserWallets', () => {
    it('should return user wallets', async () => {
      const mockWallets = [
        { id: '1', name: 'Main Wallet', type: WalletType.MAIN },
        { id: '2', name: 'Escrow Wallet', type: WalletType.ESCROW },
      ];

      walletRepository.find.mockResolvedValue(mockWallets as any);

      const result = await service.findUserWallets('user-id');

      expect(walletRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user-id' },
        relations: ['transactions'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockWallets);
    });
  });
});