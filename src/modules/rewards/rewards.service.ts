import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Reward, RewardType, RewardCategory } from './entities/reward.entity';
import { UserReward, UserRewardStatus } from './entities/user-reward.entity';
import { RewardRule, RuleType } from './entities/reward-rule.entity';
import { WalletService } from '../wallet/wallet.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType, NotificationChannel } from '../notifications/entities/notification.entity';

@Injectable()
export class RewardsService {
  private readonly logger = new Logger(RewardsService.name);

  constructor(
    @InjectRepository(Reward)
    private rewardRepository: Repository<Reward>,
    @InjectRepository(UserReward)
    private userRewardRepository: Repository<UserReward>,
    @InjectRepository(RewardRule)
    private rewardRuleRepository: Repository<RewardRule>,
    private walletService: WalletService,
    private notificationsService: NotificationsService,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('bill.paid')
  async handleBillPayment(payload: { transaction: any }): Promise<void> {
    const { transaction } = payload;
    
    try {
      // Check for applicable rewards
      const applicableRewards = await this.getApplicableRewards(
        transaction.userId,
        RewardCategory.BILL_PAYMENT,
        transaction.amount
      );

      for (const reward of applicableRewards) {
        await this.awardReward(transaction.userId, reward.id, transaction.id);
      }

      // Check for streak bonuses
      await this.checkStreakRewards(transaction.userId, RewardCategory.BILL_PAYMENT);
    } catch (error) {
      this.logger.error('Failed to process bill payment rewards:', error);
    }
  }

  async getUserRewards(userId: string, page: number = 1, limit: number = 20) {
    const [rewards, total] = await this.userRewardRepository.findAndCount({
      where: { userId },
      relations: ['reward'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      rewards,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async redeemReward(userRewardId: string, userId: string): Promise<UserReward> {
    const userReward = await this.userRewardRepository.findOne({
      where: { id: userRewardId, userId },
      relations: ['reward'],
    });

    if (!userReward) {
      throw new Error('Reward not found');
    }

    if (userReward.status !== UserRewardStatus.EARNED) {
      throw new Error('Reward already redeemed or expired');
    }

    // Credit user's main wallet with reward amount
    await this.walletService.creditMainWallet(userId, userReward.amount, 'Reward redemption');

    // Update reward status
    userReward.status = UserRewardStatus.REDEEMED;
    userReward.redeemedAt = new Date();

    await this.userRewardRepository.save(userReward);

    // Send notification
    await this.notificationsService.create({
      title: 'Reward Redeemed',
      message: `You've successfully redeemed ₦${userReward.amount} from your ${userReward.reward.name} reward`,
      type: NotificationType.GENERAL,
      channel: NotificationChannel.IN_APP,
      userId,
    });

    return userReward;
  }

  async getRewardSummary(userId: string): Promise<{
    totalEarned: number;
    totalRedeemed: number;
    availableRewards: number;
    currentStreak: number;
  }> {
    const rewards = await this.userRewardRepository.find({
      where: { userId },
    });

    const totalEarned = rewards.reduce((sum, r) => sum + Number(r.amount), 0);
    const totalRedeemed = rewards
      .filter(r => r.status === UserRewardStatus.REDEEMED)
      .reduce((sum, r) => sum + Number(r.amount), 0);
    const availableRewards = rewards
      .filter(r => r.status === UserRewardStatus.EARNED)
      .reduce((sum, r) => sum + Number(r.amount), 0);

    // Calculate current streak (simplified)
    const currentStreak = await this.calculateUserStreak(userId);

    return {
      totalEarned,
      totalRedeemed,
      availableRewards,
      currentStreak,
    };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async processExpiredRewards(): Promise<void> {
    const expiredRewards = await this.userRewardRepository.find({
      where: {
        status: UserRewardStatus.EARNED,
        expiresAt: new Date(),
      },
    });

    for (const reward of expiredRewards) {
      reward.status = UserRewardStatus.EXPIRED;
      await this.userRewardRepository.save(reward);
    }

    this.logger.log(`Processed ${expiredRewards.length} expired rewards`);
  }

  private async getApplicableRewards(
    userId: string,
    category: RewardCategory,
    amount: number
  ): Promise<Reward[]> {
    return this.rewardRepository.find({
      where: {
        category,
        isActive: true,
      },
    });
  }

  private async awardReward(userId: string, rewardId: string, transactionId?: string): Promise<void> {
    const reward = await this.rewardRepository.findOne({ where: { id: rewardId } });
    if (!reward) return;

    let rewardAmount = 0;
    
    if (reward.type === RewardType.CASHBACK) {
      // Calculate cashback based on transaction amount
      const transaction = transactionId ? 
        await this.walletService.getTransactionById(transactionId) : null;
      rewardAmount = transaction ? (Number(transaction.amount) * Number(reward.value)) / 100 : 0;
    } else {
      rewardAmount = Number(reward.value);
    }

    const userReward = this.userRewardRepository.create({
      userId,
      rewardId,
      transactionId,
      amount: rewardAmount,
      reference: this.generateReference(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    await this.userRewardRepository.save(userReward);

    // Send notification
    await this.notificationsService.create({
      title: 'Reward Earned!',
      message: `You've earned ₦${rewardAmount} from ${reward.name}`,
      type: NotificationType.GENERAL,
      channel: NotificationChannel.IN_APP,
      userId,
    });
  }

  private async checkStreakRewards(userId: string, category: RewardCategory): Promise<void> {
    const streak = await this.calculateUserStreak(userId);
    
    // Award streak bonuses at milestones
    const streakMilestones = [7, 14, 30, 60, 90];
    
    if (streakMilestones.includes(streak)) {
      const bonusAmount = streak * 10; // ₦10 per day in streak
      
      const userReward = this.userRewardRepository.create({
        userId,
        rewardId: null, // System generated reward
        amount: bonusAmount,
        reference: this.generateReference(),
        metadata: { type: 'streak_bonus', streak },
      });

      await this.userRewardRepository.save(userReward);
    }
  }

  private async calculateUserStreak(userId: string): Promise<number> {
    // Simplified streak calculation
    // In reality, this would analyze consecutive days of bill payments
    return 0;
  }

  private generateReference(): string {
    return `RWD_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
}