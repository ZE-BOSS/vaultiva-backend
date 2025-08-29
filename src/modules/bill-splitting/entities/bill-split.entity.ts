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
import { BillSplitParticipant } from './bill-split-participant.entity';

export enum SplitType {
  ONE_TO_MANY = 'one_to_many',
  MANY_TO_ONE = 'many_to_one',
}

export enum SplitFrequency {
  ONE_TIME = 'one_time',
  RECURRING = 'recurring',
}

export enum SplitStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('bill_splits')
export class BillSplit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalAmount: number;

  @Column({ type: 'enum', enum: SplitType })
  type: SplitType;

  @Column({ type: 'enum', enum: SplitFrequency })
  frequency: SplitFrequency;

  @Column({ type: 'enum', enum: SplitStatus, default: SplitStatus.PENDING })
  status: SplitStatus;

  @Column()
  reference: string;

  @Column({ type: 'timestamp', nullable: true })
  nextExecutionDate: Date;

  @Column({ type: 'json', nullable: true })
  schedule: any;

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

  @OneToMany(() => BillSplitParticipant, (participant) => participant.billSplit)
  participants: BillSplitParticipant[];
}