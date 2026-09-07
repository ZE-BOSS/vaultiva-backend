import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SharedWalletTransaction } from './shared-wallet-transaction.entity';

export enum SignatureStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('transaction_signatures')
export class TransactionSignature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: SignatureStatus, default: SignatureStatus.PENDING })
  status: SignatureStatus;

  @Column({ nullable: true })
  comment: string;

  @Column('uuid')
  signerId: string;

  @Column('uuid')
  transactionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'signerId' })
  signer: User;

  @ManyToOne(() => SharedWalletTransaction, (transaction) => transaction.signatures)
  @JoinColumn({ name: 'transactionId' })
  transaction: SharedWalletTransaction;
}