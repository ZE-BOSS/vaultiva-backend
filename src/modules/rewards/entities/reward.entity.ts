import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserReward } from './user-reward.entity';

export enum RewardType {
  CASHBACK = 'cashback',
  DISCOUNT = 'discount',
  STREAK_BONUS = 'streak_bonus',
  MILESTONE = 'milestone',
}

export enum RewardCategory {
  BILL_PAYMENT = 'bill_payment',
  TRANSFER = 'transfer',
  GENERAL = 'general',
}

@Entity('rewards')
export class Reward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'enum', enum: RewardType })
  type: RewardType;

  @Column({ type: 'enum', enum: RewardCategory })
  category: RewardCategory;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  value: number; // Percentage for cashback/discount, fixed amount for others

  @Column({ type: 'json' })
  conditions: any;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  validFrom: Date;

  @Column({ type: 'timestamp', nullable: true })
  validUntil: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserReward, (userReward) => userReward.reward)
  userRewards: UserReward[];
}