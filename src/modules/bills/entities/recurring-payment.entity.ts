import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Transaction } from '@/modules/wallet/entities/transaction.entity';

export enum RecurrenceFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom',
}

export enum RecurringStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
}

@Entity('recurring_payments')
export class RecurringPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  transactionId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => Transaction)
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column()
  duration: number;

  @Column({ type: 'enum', enum: RecurrenceFrequency })
  frequency: RecurrenceFrequency;

  @Column({ type: 'enum', enum: RecurringStatus, default: RecurringStatus.ACTIVE })
  status: RecurringStatus;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
