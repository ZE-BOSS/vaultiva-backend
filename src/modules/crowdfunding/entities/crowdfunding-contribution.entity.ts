import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CrowdfundingCampaign } from './crowdfunding-campaign.entity';

@Entity('crowdfunding_contributions')
export class CrowdfundingContribution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  message: string;

  @Column({ default: false })
  isAnonymous: boolean;

  @Column()
  reference: string;

  @Column('uuid')
  contributorId: string;

  @Column('uuid')
  campaignId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'contributorId' })
  contributor: User;

  @ManyToOne(() => CrowdfundingCampaign, (campaign) => campaign.contributions)
  @JoinColumn({ name: 'campaignId' })
  campaign: CrowdfundingCampaign;
}