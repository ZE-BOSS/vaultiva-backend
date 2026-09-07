import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DowntimeStatus {
  ACTIVE = 'active',
  RESOLVED = 'resolved',
  SCHEDULED = 'scheduled',
}

export enum DowntimeType {
  MAINTENANCE = 'maintenance',
  OUTAGE = 'outage',
  PARTIAL = 'partial',
}

@Entity('bank_downtimes')
export class BankDowntime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bankCode: string;

  @Column()
  bankName: string;

  @Column({ type: 'enum', enum: DowntimeType })
  type: DowntimeType;

  @Column({ type: 'enum', enum: DowntimeStatus })
  status: DowntimeStatus;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  estimatedEndTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualEndTime: Date;

  @Column({ type: 'json', nullable: true })
  affectedServices: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}