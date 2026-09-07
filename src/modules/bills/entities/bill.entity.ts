import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BillPayment } from './bill-payment.entity';

export enum BillCategory {
  AIRTIME = 'airtime',
  DATA = 'data',
  ELECTRICITY = 'electricity',
  TV = 'tv',
  INTERNET = 'internet',
  BETTING = 'betting',
}

export enum BillProvider {
  FLUTTERWAVE = 'flutterwave',
  INTERSWITCH = 'interswitch',
}

@Entity('bills')
export class Bill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  billerCode: string;

  @Column()
  itemCode: string;

  @Column({ type: 'enum', enum: BillCategory })
  category: BillCategory;

  @Column({ type: 'enum', enum: BillProvider })
  provider: BillProvider;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  fee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minimumAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maximumAmount: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  hasDowntime: boolean;

  @Column({ type: 'timestamp', nullable: true })
  downtimeStart: Date;

  @Column({ type: 'timestamp', nullable: true })
  downtimeEnd: Date;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BillPayment, (payment) => payment.bill)
  payments: BillPayment[];
}