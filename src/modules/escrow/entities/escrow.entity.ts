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
import { EscrowParticipant } from './escrow-participant.entity';

export enum EscrowType {
  ONE_TIME = 'one_time',
  RECURRING = 'recurring',
}

export enum EscrowMode {
  SINGLE = 'single',
  GROUP = 'group',
}

export enum EscrowStatus {
  PENDING = 'pending',
  FUNDED = 'funded',
  RELEASED = 'released',
  DISPUTED = 'disputed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

@Entity('escrows')
export class Escrow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: EscrowType })
  type: EscrowType;

  @Column({ type: 'enum', enum: EscrowMode })
  mode: EscrowMode;

  @Column({ type: 'enum', enum: EscrowStatus, default: EscrowStatus.PENDING })
  status: EscrowStatus;

  @Column()
  reference: string;

  @Column({ type: 'timestamp' })
  releaseDate: Date;

  @Column({ type: 'json', nullable: true })
  conditions: any;

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

  @OneToMany(() => EscrowParticipant, (participant) => participant.escrow)
  participants: EscrowParticipant[];
}