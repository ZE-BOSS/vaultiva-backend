import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { FlutterwaveService } from './services/flutterwave.service';
import { Transaction } from '../wallet/entities/transaction.entity';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    WalletModule,
  ],
  providers: [PaymentsService, FlutterwaveService],
  exports: [PaymentsService, FlutterwaveService],
})
export class PaymentsModule {}