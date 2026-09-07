import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrowdfundingService } from './crowdfunding.service';
import { CrowdfundingController } from './crowdfunding.controller';
import { CrowdfundingCampaign } from './entities/crowdfunding-campaign.entity';
import { CrowdfundingContribution } from './entities/crowdfunding-contribution.entity';
import { WalletModule } from '../wallet/wallet.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CrowdfundingCampaign, CrowdfundingContribution]),
    WalletModule,
    NotificationsModule,
  ],
  controllers: [CrowdfundingController],
  providers: [CrowdfundingService],
  exports: [CrowdfundingService],
})
export class CrowdfundingModule {}