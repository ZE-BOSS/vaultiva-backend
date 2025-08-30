import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { Wallet } from '@/modules/wallet/entities/wallet.entity';
import { Transaction } from '@/modules/wallet/entities/transaction.entity';
import { Bill } from '@/modules/bills/entities/bill.entity';
import { BillPayment } from '@/modules/bills/entities/bill-payment.entity';
import { RecurringPayment } from '@/modules/bills/entities/recurring-payment.entity';
import { Notification } from '@/modules/notifications/entities/notification.entity';
import { Escrow } from '@/modules/escrow/entities/escrow.entity';
import { EscrowParticipant } from '@/modules/escrow/entities/escrow-participant.entity';
import { BillSplit } from '@/modules/bill-splitting/entities/bill-split.entity';
import { BillSplitParticipant } from '@/modules/bill-splitting/entities/bill-split-participant.entity';
import { CrowdfundingCampaign } from '@/modules/crowdfunding/entities/crowdfunding-campaign.entity';
import { CrowdfundingContribution } from '@/modules/crowdfunding/entities/crowdfunding-contribution.entity';
import { SharedWallet } from '@/modules/shared-wallets/entities/shared-wallet.entity';
import { SharedWalletMember } from '@/modules/shared-wallets/entities/shared-wallet-member.entity';
import { SharedWalletTransaction } from '@/modules/shared-wallets/entities/shared-wallet-transaction.entity';
import { TransactionSignature } from '@/modules/shared-wallets/entities/transaction-signature.entity';
import { SpendingInsight } from '@/modules/ai-insights/entities/spending-insight.entity';
import { BudgetRecommendation } from '@/modules/ai-insights/entities/budget-recommendation.entity';
import { Reward } from '@/modules/rewards/entities/reward.entity';
import { UserReward } from '@/modules/rewards/entities/user-reward.entity';
import { RewardRule } from '@/modules/rewards/entities/reward-rule.entity';
import { LedgerEntry } from '@/modules/ledger/entities/ledger-entry.entity';
import { ReconciliationRecord } from '@/modules/ledger/entities/reconciliation-record.entity';
import { Transfer } from '@/modules/transfers/entities/transfer.entity';
import { ScheduledTransfer } from '@/modules/transfers/entities/scheduled-transfer.entity';
import { BankDowntime } from '@/modules/transfers/entities/bank-downtime.entity';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: this.configService.get('DB_PORT', 5432),
      username: this.configService.get('DB_USERNAME', 'postgres'),
      password: this.configService.get('DB_PASSWORD', 'password'),
      database: this.configService.get('DB_NAME', 'vaultiva_db'),
      entities: [
        User,
        Wallet,
        Transaction,
        Bill,
        BillPayment,
        RecurringPayment,
        Notification,
        Escrow,
        EscrowParticipant,
        BillSplit,
        BillSplitParticipant,
        CrowdfundingCampaign,
        CrowdfundingContribution,
        SharedWallet,
        SharedWalletMember,
        SharedWalletTransaction,
        TransactionSignature,
        SpendingInsight,
        BudgetRecommendation,
        Reward,
        UserReward,
        RewardRule,
        LedgerEntry,
        ReconciliationRecord,
        Transfer,
        ScheduledTransfer,
        BankDowntime,
      ],
      synchronize: this.configService.get('NODE_ENV') === 'development',
      ssl: this.configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      logging: this.configService.get('NODE_ENV') === 'development',
      migrations: ['dist/modules/database/migrations/*.js'],
      migrationsRun: true,
    };
  }
}