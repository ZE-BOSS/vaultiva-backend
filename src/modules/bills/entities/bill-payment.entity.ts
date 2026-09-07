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
import { Bill } from './bill.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';

export enum BillPaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('bill_payments')
export class BillPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column()
  customer: string;

  @Column({ type: 'enum', enum: BillPaymentStatus, default: BillPaymentStatus.PENDING })
  status: BillPaymentStatus;

  @Column()
  reference: string;

  @Column({ nullable: true })
  providerReference: string;

  @Column({ nullable: true })
  failureReason: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  billId: string;

  @Column('uuid')
  walletId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Bill, (bill) => bill.payments)
  @JoinColumn({ name: 'billId' })
  bill: Bill;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'walletId' })
  wallet: Wallet;
}