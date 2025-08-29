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

export enum RecommendationType {
  REDUCE_SPENDING = 'reduce_spending',
  INCREASE_SAVINGS = 'increase_savings',
  OPTIMIZE_BILLS = 'optimize_bills',
  INVESTMENT_OPPORTUNITY = 'investment_opportunity',
}

@Entity('budget_recommendations')
export class BudgetRecommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: RecommendationType })
  type: RecommendationType;

  @Column()
  category: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  currentSpending: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  recommendedSpending: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  potentialSavings: number;

  @Column('text')
  explanation: string;

  @Column({ type: 'json' })
  actionItems: string[];

  @Column({ default: false })
  isImplemented: boolean;

  @Column('uuid')
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}