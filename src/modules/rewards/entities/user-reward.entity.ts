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
import { Reward } from './reward.entity';
import { Transaction } from '../../wallet/entities/transaction.entity';

export enum UserRewardStatus {
  EARNED = 'earned',
  REDEEMED = 'redeemed',
  EXPIRED = 'expired',
}

@Entity('user_rewards')
export class UserReward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: UserRewardStatus, default: UserRewardStatus.EARNED })
  status: UserRewardStatus;

  @Column()
  reference: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ type: 'timestamp', nullable: true })
  redeemedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  rewardId: string;

  @Column('uuid', { nullable: true })
  transactionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Reward)
  @JoinColumn({ name: 'rewardId' })
  reward: Reward;

  @ManyToOne(() => Transaction, { nullable: true })
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction;
}