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
import { Escrow } from './escrow.entity';

export enum ParticipantRole {
  PAYER = 'payer',
  PAYEE = 'payee',
  ARBITRATOR = 'arbitrator',
}

export enum ParticipantStatus {
  INVITED = 'invited',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

@Entity('escrow_participants')
export class EscrowParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ParticipantRole })
  role: ParticipantRole;

  @Column({ type: 'enum', enum: ParticipantStatus, default: ParticipantStatus.INVITED })
  status: ParticipantStatus;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  contributionAmount: number;

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt: Date;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  escrowId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Escrow, (escrow) => escrow.participants)
  @JoinColumn({ name: 'escrowId' })
  escrow: Escrow;
}