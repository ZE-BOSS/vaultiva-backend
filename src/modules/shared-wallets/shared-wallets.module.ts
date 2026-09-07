import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedWalletsService } from './shared-wallets.service';
import { SharedWalletsController } from './shared-wallets.controller';
import { SharedWallet } from './entities/shared-wallet.entity';
import { SharedWalletMember } from './entities/shared-wallet-member.entity';
import { SharedWalletTransaction } from './entities/shared-wallet-transaction.entity';
import { TransactionSignature } from './entities/transaction-signature.entity';
import { WalletModule } from '../wallet/wallet.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SharedWallet,
      SharedWalletMember,
      SharedWalletTransaction,
      TransactionSignature,
    ]),
    WalletModule,
    NotificationsModule,
  ],
  controllers: [SharedWalletsController],
  providers: [SharedWalletsService],
  exports: [SharedWalletsService],
})
export class SharedWalletsModule {}