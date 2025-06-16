import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill, BillType } from './entities/bill.entity';
import { BillPayment } from './entities/bill-payment.entity';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private billRepository: Repository<Bill>,
    @InjectRepository(BillPayment)
    private billPaymentRepository: Repository<BillPayment>,
    private paymentsService: PaymentsService,
  ) {}

  async findAll(): Promise<Bill[]> {
    return this.billRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findByType(type: BillType): Promise<Bill[]> {
    return this.billRepository.find({
      where: { type, isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findById(id: string): Promise<Bill> {
    const bill = await this.billRepository.findOne({
      where: { id },
      relations: ['payments'],
    });

    if (!bill) {
      throw new NotFoundException(`Bill with ID ${id} not found`);
    }

    return bill;
  }

  async getUserBillPayments(userId: string): Promise<BillPayment[]> {
    return this.billPaymentRepository.find({
      where: { userId },
      relations: ['bill'],
      order: { createdAt: 'DESC' },
    });
  }

  async getBillPaymentById(id: string): Promise<BillPayment> {
    const payment = await this.billPaymentRepository.findOne({
      where: { id },
      relations: ['bill', 'user'],
    });

    if (!payment) {
      throw new NotFoundException(`Bill payment with ID ${id} not found`);
    }

    return payment;
  }
}