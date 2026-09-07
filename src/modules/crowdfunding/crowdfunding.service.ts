import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CrowdfundingCampaign, CampaignStatus } from './entities/crowdfunding-campaign.entity';
import { CrowdfundingContribution } from './entities/crowdfunding-contribution.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { ContributeDto } from './dto/contribute.dto';
import { WalletService } from '../wallet/wallet.service';
import { WalletType } from '../wallet/entities/wallet.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType, NotificationChannel } from '../notifications/entities/notification.entity';

@Injectable()
export class CrowdfundingService {
  constructor(
    @InjectRepository(CrowdfundingCampaign)
    private campaignRepository: Repository<CrowdfundingCampaign>,
    @InjectRepository(CrowdfundingContribution)
    private contributionRepository: Repository<CrowdfundingContribution>,
    private walletService: WalletService,
    private notificationsService: NotificationsService,
    private eventEmitter: EventEmitter2,
    private dataSource: DataSource,
  ) {}

  async createCampaign(creatorId: string, createCampaignDto: CreateCampaignDto): Promise<CrowdfundingCampaign> {
    // Create a dedicated wallet for this campaign
    const campaignWallet = await this.walletService.createWallet(creatorId, {
      type: WalletType.OTHERS,
      name: `Crowdfunding: ${createCampaignDto.title}`,
      customerId: '', // Will be set by wallet service
    });

    const shareableLink = this.generateShareableLink();

    const campaign = this.campaignRepository.create({
      ...createCampaignDto,
      creatorId,
      walletId: campaignWallet.id,
      shareableLink,
      endDate: new Date(createCampaignDto.endDate),
    });

    return this.campaignRepository.save(campaign);
  }

  async findUserCampaigns(userId: string, page: number = 1, limit: number = 20) {
    const [campaigns, total] = await this.campaignRepository.findAndCount({
      where: { creatorId: userId },
      relations: ['contributions', 'wallet'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      campaigns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getPublicCampaign(shareableLink: string): Promise<CrowdfundingCampaign> {
    const campaign = await this.campaignRepository.findOne({
      where: { shareableLink },
      relations: ['creator', 'contributions'],
      select: {
        creator: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    if (campaign.status !== CampaignStatus.ACTIVE) {
      throw new BadRequestException('Campaign is not active');
    }

    return campaign;
  }

  async findOne(id: string, userId: string): Promise<CrowdfundingCampaign> {
    const campaign = await this.campaignRepository.findOne({
      where: { id },
      relations: ['contributions', 'contributions.contributor', 'wallet', 'creator'],
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Check if user has access (creator or public campaign)
    if (campaign.creatorId !== userId && campaign.status !== CampaignStatus.ACTIVE) {
      throw new ForbiddenException('Access denied');
    }

    return campaign;
  }

  async contribute(
    campaignId: string,
    contributorId: string,
    contributeDto: ContributeDto,
  ): Promise<CrowdfundingContribution> {
    const campaign = await this.campaignRepository.findOne({
      where: { id: campaignId },
      relations: ['wallet'],
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    if (campaign.status !== CampaignStatus.ACTIVE) {
      throw new BadRequestException('Campaign is not active');
    }

    if (new Date() > campaign.endDate) {
      throw new BadRequestException('Campaign has expired');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Transfer funds from contributor's main wallet to campaign wallet
      await this.walletService.transferBetweenWallets(
        contributorId,
        campaign.walletId,
        contributeDto.amount,
        `Crowdfunding contribution: ${campaign.title}`,
      );

      // Create contribution record
      const contribution = queryRunner.manager.create(CrowdfundingContribution, {
        ...contributeDto,
        contributorId,
        campaignId,
        reference: this.generateReference(),
      });

      const savedContribution = await queryRunner.manager.save(contribution);

      // Update campaign raised amount
      await queryRunner.manager.update(CrowdfundingCampaign, campaignId, {
        raisedAmount: () => `raised_amount + ${contributeDto.amount}`,
      });

      // Check if target reached
      const updatedCampaign = await queryRunner.manager.findOne(CrowdfundingCampaign, {
        where: { id: campaignId },
      });

      if (updatedCampaign && updatedCampaign.raisedAmount >= updatedCampaign.targetAmount) {
        await queryRunner.manager.update(CrowdfundingCampaign, campaignId, {
          status: CampaignStatus.COMPLETED,
        });
      }

      await queryRunner.commitTransaction();

      // Notify campaign creator
      await this.notificationsService.create({
        title: 'New Contribution',
        message: `Someone contributed ₦${contributeDto.amount} to your campaign "${campaign.title}"`,
        type: NotificationType.GENERAL,
        channel: NotificationChannel.IN_APP,
        userId: campaign.creatorId,
      });

      this.eventEmitter.emit('crowdfunding.contribution', { 
        campaign, 
        contribution: savedContribution 
      });

      return savedContribution;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getCampaignContributions(campaignId: string, page: number = 1, limit: number = 20) {
    const [contributions, total] = await this.contributionRepository.findAndCount({
      where: { campaignId },
      relations: ['contributor'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        contributor: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    });

    return {
      contributions: contributions.map(c => ({
        ...c,
        contributor: c.isAnonymous ? null : c.contributor,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  private generateShareableLink(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private generateReference(): string {
    return `CROWD_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
}