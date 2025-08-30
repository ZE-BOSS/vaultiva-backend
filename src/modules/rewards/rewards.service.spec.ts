import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RewardsService } from './rewards.service';
import { Reward, RewardType } from './entities/reward.entity';
import { UserReward, UserRewardStatus } from './entities/user-reward.entity';
import { RewardRule } from './entities/reward-rule.entity';
import { WalletService } from '../wallet/wallet.service';
import { NotificationsService } from '../notifications/notifications.service';

describe('RewardsService', () => {
  let service: RewardsService;
  let userRewardRepository: jest.Mocked<Repository<UserReward>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardsService,
        {
          provide: getRepositoryToken(Reward),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserReward),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(RewardRule),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: WalletService,
          useValue: {
            creditMainWallet: jest.fn(),
            getTransactionById: jest.fn(),
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
      ],
    }).compile();

    service = module.get<RewardsService>(RewardsService);
    userRewardRepository = module.get(getRepositoryToken(UserReward));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('redeemReward', () => {
    it('should redeem an earned reward', async () => {
      const mockUserReward = {
        id: '1',
        userId: 'user-id',
        amount: 100,
        status: UserRewardStatus.EARNED,
        reward: { name: 'Test Reward' },
      };

      userRewardRepository.findOne.mockResolvedValue(mockUserReward as any);
      userRewardRepository.save.mockResolvedValue(mockUserReward as any);

      const result = await service.redeemReward('reward-id', 'user-id');

      expect(result.status).toBe(UserRewardStatus.REDEEMED);
      expect(userRewardRepository.save).toHaveBeenCalled();
    });
  });
});