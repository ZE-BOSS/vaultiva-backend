import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { Wallet } from '@/modules/wallet/entities/wallet.entity';
import { Transaction } from '@/modules/wallet/entities/transaction.entity';
import { Bill } from '@/modules/bills/entities/bill.entity';
import { BillPayment } from '@/modules/bills/entities/bill-payment.entity';
import { Notification } from '@/modules/notifications/entities/notification.entity';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DATABASE_HOST'),
      port: this.configService.get('DATABASE_PORT'),
      username: this.configService.get('DATABASE_USERNAME'),
      password: this.configService.get('DATABASE_PASSWORD'),
      database: this.configService.get('DATABASE_NAME'),
      entities: [
        User,
        Wallet,
        Transaction,
        Bill,
        BillPayment,
        Notification,
      ],
      synchronize: this.configService.get('NODE_ENV') === 'development',
      ssl: this.configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      logging: this.configService.get('NODE_ENV') === 'development',
    };
  }
}