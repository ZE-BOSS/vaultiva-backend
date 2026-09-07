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
import { SharedWallet } from './shared-wallet.entity';

export enum MemberRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

export enum MemberStatus {
  INVITED = 'invited',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

@Entity('shared_wallet_members')
export class SharedWalletMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: MemberRole })
  role: MemberRole;

  @Column({ type: 'enum', enum: MemberStatus, default: MemberStatus.INVITED })
  status: MemberStatus;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  spendingLimit: number;

  @Column({ type: 'json', nullable: true })
  permissions: string[];

  @Column({ type: 'timestamp', nullable: true })
  joinedAt: Date;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  sharedWalletId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => SharedWallet, (sharedWallet) => sharedWallet.members)
  @JoinColumn({ name: 'sharedWalletId' })
  sharedWallet: SharedWallet;
}