import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RuleType {
  STREAK = 'streak',
  AMOUNT_THRESHOLD = 'amount_threshold',
  FREQUENCY = 'frequency',
  CATEGORY_SPENDING = 'category_spending',
}

@Entity('reward_rules')
export class RewardRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: RuleType })
  type: RuleType;

  @Column({ type: 'json' })
  conditions: any;

  @Column({ type: 'json' })
  rewards: any;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}