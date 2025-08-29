import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../../common/decorators/roles.decorator';
import { Wallet } from '@/modules/wallet/entities/wallet.entity';
import { Notification } from '@/modules/notifications/entities/notification.entity';

export { Role as UserRole };

export interface VerificationCode {
  id: string;
  category: string;
  code: string;
  expires: Date;
}

export enum KYCStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  APPROVED = 'approved',
  NOT_STARTED = 'not_started'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  bvn: number;

  @Column()
  nin: number;

  @Column()
  accountNumber: number;

  @Column()
  bank: string;

  @Column()
  accountName: string;

  @Column()
  address: string;

  @Column()
  dateOfBirth: string;

  @Column({ nullable: true, type: 'text' })
  biometricPublicKey?: string;

  @Column({ nullable: true, unique: true })
  phone: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column('jsonb', { default: [] })
  codes: VerificationCode[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ type: 'enum', enum: KYCStatus, default: KYCStatus.NOT_STARTED })
  kycStatus: KYCStatus;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column()
  loginDevice: string;

  @Column({ nullable: true })
  @Exclude()
  pin: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @BeforeInsert()
  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
