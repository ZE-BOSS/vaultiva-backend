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
import { Wallet } from '../../wallet/entities/wallet.entity';
import { BillSplit } from './bill-split.entity';

export enum ParticipantRole {
  SENDER = 'sender',
  RECEIVER = 'receiver',
}

export enum ParticipantStatus {
  INVITED = 'invited',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  COMPLETED = 'completed',
}

@Entity('bill_split_participants')
export class BillSplitParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ParticipantRole })
  role: ParticipantRole;

  @Column({ type: 'enum', enum: ParticipantStatus, default: ParticipantStatus.INVITED })
  status: ParticipantStatus;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastPaymentDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextReminderDate: Date;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  walletId: string;

  @Column('uuid')
  billSplitId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'walletId' })
  wallet: Wallet;

  @ManyToOne(() => BillSplit, (billSplit) => billSplit.participants)
  @JoinColumn({ name: 'billSplitId' })
  billSplit: BillSplit;
}