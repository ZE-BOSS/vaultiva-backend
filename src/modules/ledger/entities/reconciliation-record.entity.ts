import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ReconciliationType {
  AUTOMATIC = 'automatic',
  MANUAL = 'manual',
}

export enum ReconciliationStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('reconciliation_records')
export class ReconciliationRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ReconciliationType })
  type: ReconciliationType;

  @Column({ type: 'enum', enum: ReconciliationStatus })
  status: ReconciliationStatus;

  @Column({ type: 'date' })
  reconciliationDate: Date;

  @Column({ type: 'int', default: 0 })
  totalEntries: number;

  @Column({ type: 'int', default: 0 })
  reconciledEntries: number;

  @Column({ type: 'int', default: 0 })
  discrepancies: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'json', nullable: true })
  discrepancyDetails: any;

  @Column({ nullable: true })
  performedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}