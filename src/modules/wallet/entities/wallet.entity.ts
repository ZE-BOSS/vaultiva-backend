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
import { Transaction } from './transaction.entity';

export enum WalletType {
  MAIN = 'main',
  ESCROW = 'escrow',
  SPLIT_BILL = 'split_bill',
  BILL_PAYMENT = 'bill_payment',
  OTHERS = 'others',
}

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  customerId: string

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'enum', enum: WalletType, default: WalletType.MAIN })
  type: WalletType;

  @Column()
  name: string;

  @Column({ default: 'NGN' })
  currency: string;

  @Column({ default: true })
  isActive: boolean;

  /**
   * The real bank account behind this wallet, provisioned at Xpress Wallet.
   *
   * Until these are populated the wallet is a local ledger row only: it cannot
   * receive an inbound transfer, because there is no account number to send to.
   * They stay null until KYC supplies a BVN — Xpress will not open an account
   * without one.
   */
  @Column({ nullable: true })
  accountNumber: string;

  @Column({ nullable: true })
  accountName: string;

  @Column({ nullable: true })
  bankName: string;

  @Column({ nullable: true })
  bankCode: string;

  /** Xpress's own id for the wallet, needed for later calls. */
  @Column({ nullable: true })
  providerWalletId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.wallets)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Transaction[];
}