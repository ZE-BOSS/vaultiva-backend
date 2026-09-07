import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EscrowService } from './escrow.service';
import { Escrow, EscrowStatus } from './entities/escrow.entity';
import { EscrowParticipant } from './entities/escrow-participant.entity';
import { WalletService } from '../wallet/wallet.service';
import { NotificationsService } from '../notifications/notifications.service';

describe('EscrowService', () => {
  let service: EscrowService;
  let escrowRepository: jest.Mocked<Repository<Escrow>>;
  let participantRepository: jest.Mocked<Repository<EscrowParticipant>>;
  let walletService: jest.Mocked<WalletService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EscrowService,
        {
          provide: getRepositoryToken(Escrow),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(EscrowParticipant),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: WalletService,
          useValue: {
            findUserWalletByType: jest.fn(),
            transferBetweenWallets: jest.fn(),
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
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
                create: jest.fn(),
                save: jest.fn(),
                update: jest.fn(),
              },
            })),
          },
        },
      ],
    }).compile();

    service = module.get<EscrowService>(EscrowService);
    escrowRepository = module.get(getRepositoryToken(Escrow));
    participantRepository = module.get(getRepositoryToken(EscrowParticipant));
    walletService = module.get(WalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new escrow', async () => {
      const createEscrowDto = {
        title: 'Test Escrow',
        description: 'Test description',
        amount: 10000,
        type: 'one_time' as any,
        mode: 'single' as any,
        releaseDate: new Date().toISOString(),
        participants: [],
      };

      walletService.findUserWalletByType.mockResolvedValue({
        id: 'wallet-id',
      } as any);

      const result = await service.create('user-id', createEscrowDto);
      
      expect(walletService.findUserWalletByType).toHaveBeenCalled();
    });
  });
});