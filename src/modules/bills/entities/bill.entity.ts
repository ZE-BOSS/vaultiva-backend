import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BillPayment } from './bill-payment.entity';

export enum BillType {
  ELECTRICITY = 'electricity',
  AIRTIME = 'airtime',
  DATA = 'data',
  INTERNET = 'internet',
  TV_SUBSCRIPTION = 'tv_subscription',
}

@Entity('bills')
export class Bill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: BillType })
  type: BillType;

  @Column()
  provider: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BillPayment, (payment) => payment.bill)
  payments: BillPayment[];
}