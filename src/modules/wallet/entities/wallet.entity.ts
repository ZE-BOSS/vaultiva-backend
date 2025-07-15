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
  SAVINGS = 'savings',
  BILL_PAYMENT = 'bill_payment',
}

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'enum', enum: WalletType, default: WalletType.MAIN })
  type: WalletType;

  @Column({ default: 'NGN' })
  currency: string;

  @Column({ default: true })
  isActive: boolean;

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