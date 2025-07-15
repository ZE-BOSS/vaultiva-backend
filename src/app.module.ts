import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { DatabaseConfig } from './config/database.config';
import { RedisConfig } from './config/redis.config';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { WalletModule } from '@/modules/wallet/wallet.module';
import { BillsModule } from '@/modules/bills/bills.module';
import { NotificationsModule } from '@/modules/notifications/notifications.module';
import { PaymentsModule } from '@/modules/payments/payments.module';
import { HealthModule } from '@/modules/health/health.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),

    // Redis & Queue
    BullModule.forRootAsync({
      useClass: RedisConfig,
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.RATE_LIMIT_TTL) || 60000,
        limit: parseInt(process.env.RATE_LIMIT_LIMIT) || 100,
      },
    ]),

    // Scheduling
    ScheduleModule.forRoot(),

    // Event Emitter
    EventEmitterModule.forRoot(),

    // Logging
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    }),
    AuthModule,
    UsersModule,
    BillsModule,
    NotificationsModule,
    PaymentsModule,
    WalletModule,
    HealthModule,
  ],
})
export class AppModule {}