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
import { SharedWalletMember } from './shared-wallet-member.entity';
import { SharedWalletTransaction } from './shared-wallet-transaction.entity';

export enum SharedWalletMode {
  FREE_ACTION = 'free_action',
  SIGNATORY_REQUIRED = 'signatory_required',
}

export enum SharedWalletStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  CLOSED = 'closed',
}

@Entity('shared_wallets')
export class SharedWallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'enum', enum: SharedWalletMode })
  mode: SharedWalletMode;

  @Column({ type: 'enum', enum: SharedWalletStatus, default: SharedWalletStatus.ACTIVE })
  status: SharedWalletStatus;

  @Column({ type: 'int', default: 1 })
  requiredSignatures: number;

  @Column({ type: 'json', nullable: true })
  rules: any;

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

  @OneToMany(() => SharedWalletMember, (member) => member.sharedWallet)
  members: SharedWalletMember[];

  @OneToMany(() => SharedWalletTransaction, (transaction) => transaction.sharedWallet)
  transactions: SharedWalletTransaction[];
}