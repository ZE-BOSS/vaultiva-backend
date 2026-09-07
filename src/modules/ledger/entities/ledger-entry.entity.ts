import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum LedgerEntryType {
  DEBIT = 'debit',
  CREDIT = 'credit',
}

export enum LedgerProvider {
  PROVIDUS = 'providus',
  FLUTTERWAVE = 'flutterwave',
  INTERSWITCH = 'interswitch',
  INTERNAL = 'internal',
}

export enum LedgerStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  RECONCILED = 'reconciled',
}

@Entity('ledger_entries')
@Index(['userId', 'createdAt'])
@Index(['provider', 'providerReference'])
@Index(['reference'])
export class LedgerEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Indexed by the class-level @Index(['reference']) above. Declaring it here as
  // well produced a second CREATE INDEX with the same generated name, which made
  // schema synchronisation fail outright.
  @Column()
  reference: string;

  @Column({ type: 'enum', enum: LedgerEntryType })
  type: LedgerEntryType;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  fee: number;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: LedgerProvider })
  provider: LedgerProvider;

  @Column({ nullable: true })
  providerReference: string;

  @Column({ type: 'enum', enum: LedgerStatus })
  status: LedgerStatus;

  @Column('uuid')
  userId: string;

  @Column('uuid', { nullable: true })
  walletId: string;

  @Column('uuid', { nullable: true })
  transactionId: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ type: 'timestamp', nullable: true })
  reconciledAt: Date;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}