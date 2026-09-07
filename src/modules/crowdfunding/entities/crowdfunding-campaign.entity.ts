import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { CrowdfundingContribution } from './crowdfunding-contribution.entity';

export enum CampaignStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

@Entity('crowdfunding_campaigns')
export class CrowdfundingCampaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  targetAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  raisedAmount: number;

  @Column({ type: 'enum', enum: CampaignStatus, default: CampaignStatus.ACTIVE })
  status: CampaignStatus;

  @Column()
  shareableLink: string;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column('uuid')
  creatorId: string;

  @Column('uuid')
  walletId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'walletId' })
  wallet: Wallet;

  @OneToMany(() => CrowdfundingContribution, (contribution) => contribution.campaign)
  contributions: CrowdfundingContribution[];

  get progressPercentage(): number {
    return Math.min((Number(this.raisedAmount) / Number(this.targetAmount)) * 100, 100);
  }
}