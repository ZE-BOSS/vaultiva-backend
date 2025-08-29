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
import { SharedWallet } from './shared-wallet.entity';
import { TransactionSignature } from './transaction-signature.entity';

export enum SharedTransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
  TRANSFER = 'transfer',
}

export enum SharedTransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXECUTED = 'executed',
}

@Entity('shared_wallet_transactions')
export class SharedWalletTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: SharedTransactionType })
  type: SharedTransactionType;

  @Column({ type: 'enum', enum: SharedTransactionStatus, default: SharedTransactionStatus.PENDING })
  status: SharedTransactionStatus;

  @Column()
  reference: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column('uuid')
  initiatorId: string;

  @Column('uuid')
  sharedWalletId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'initiatorId' })
  initiator: User;

  @ManyToOne(() => SharedWallet, (sharedWallet) => sharedWallet.transactions)
  @JoinColumn({ name: 'sharedWalletId' })
  sharedWallet: SharedWallet;

  @OneToMany(() => TransactionSignature, (signature) => signature.transaction)
  signatures: TransactionSignature[];
}