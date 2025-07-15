import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { Transaction } from '../wallet/entities/transaction.entity';
import { WalletModule } from '../wallet/wallet.module';
import { FlutterwaveModule } from '../flutterwave/flutterwave.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    FlutterwaveModule,
    forwardRef(() => WalletModule),
  ],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}