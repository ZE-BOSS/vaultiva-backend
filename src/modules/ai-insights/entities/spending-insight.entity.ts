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

export enum InsightType {
  SPENDING_PATTERN = 'spending_pattern',
  BUDGET_ALERT = 'budget_alert',
  SAVING_OPPORTUNITY = 'saving_opportunity',
  CATEGORY_ANALYSIS = 'category_analysis',
}

export enum InsightPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('spending_insights')
export class SpendingInsight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: InsightType })
  type: InsightType;

  @Column({ type: 'enum', enum: InsightPriority })
  priority: InsightPriority;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  recommendation: string;

  @Column({ type: 'json' })
  data: any;

  @Column({ default: false })
  isRead: boolean;

  @Column({ default: false })
  isActioned: boolean;

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