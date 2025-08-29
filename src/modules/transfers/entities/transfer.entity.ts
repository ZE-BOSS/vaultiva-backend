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

export enum TransferType {
  WALLET_TO_WALLET = 'wallet_to_wallet',
  WALLET_TO_BANK = 'wallet_to_bank',
  BANK_TO_WALLET = 'bank_to_wallet',
}

export enum TransferStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('transfers')
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  fee: number;

  @Column({ type: 'enum', enum: TransferType })
  type: TransferType;

  @Column({ type: 'enum', enum: TransferStatus, default: TransferStatus.PENDING })
  status: TransferStatus;

  @Column()
  reference: string;

  @Column({ nullable: true })
  providerReference: string;

  @Column()
  description: string;

  @Column({ type: 'json' })
  sourceDetails: any;

  @Column({ type: 'json' })
  destinationDetails: any;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ nullable: true })
  failureReason: string;

  @Column('uuid')
  userId: string;

  @Column('uuid', { nullable: true })
  sourceWalletId: string;

  @Column('uuid', { nullable: true })
  destinationWalletId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Wallet, { nullable: true })
  @JoinColumn({ name: 'sourceWalletId' })
  sourceWallet: Wallet;

  @ManyToOne(() => Wallet, { nullable: true })
  @JoinColumn({ name: 'destinationWalletId' })
  destinationWallet: Wallet;
}