/**
 * Every TypeORM entity, imported explicitly.
 *
 * A glob cannot be used here: `nest build` bundles the whole app into a single
 * `dist/main.js`, so at runtime `__dirname` is `dist/` and a relative glob
 * resolves back to the TypeScript sources. TypeORM then loads `.ts` files, which
 * Node's strip-only mode rejects as soon as it meets an `enum`.
 *
 * The list is explicit so webpack can see the imports, and `entities.spec.ts`
 * fails if an `@Entity` is added without registering it here — the drift that
 * previously left 21 of 27 entities off the connection and stopped the
 * application booting at all.
 */
import { BankDowntime } from '@/modules/transfers/entities/bank-downtime.entity';
import { Bill } from '@/modules/bills/entities/bill.entity';
import { BillPayment } from '@/modules/bills/entities/bill-payment.entity';
import { BillSplit } from '@/modules/bill-splitting/entities/bill-split.entity';
import { BillSplitParticipant } from '@/modules/bill-splitting/entities/bill-split-participant.entity';
import { BudgetRecommendation } from '@/modules/ai-insights/entities/budget-recommendation.entity';
import { CrowdfundingCampaign } from '@/modules/crowdfunding/entities/crowdfunding-campaign.entity';
import { CrowdfundingContribution } from '@/modules/crowdfunding/entities/crowdfunding-contribution.entity';
import { Escrow } from '@/modules/escrow/entities/escrow.entity';
import { EscrowParticipant } from '@/modules/escrow/entities/escrow-participant.entity';
import { LedgerEntry } from '@/modules/ledger/entities/ledger-entry.entity';
import { Notification } from '@/modules/notifications/entities/notification.entity';
import { ReconciliationRecord } from '@/modules/ledger/entities/reconciliation-record.entity';
import { RecurringPayment } from '@/modules/bills/entities/recurring-payment.entity';
import { Reward } from '@/modules/rewards/entities/reward.entity';
import { RewardRule } from '@/modules/rewards/entities/reward-rule.entity';
import { ScheduledTransfer } from '@/modules/transfers/entities/scheduled-transfer.entity';
import { SharedWallet } from '@/modules/shared-wallets/entities/shared-wallet.entity';
import { SharedWalletMember } from '@/modules/shared-wallets/entities/shared-wallet-member.entity';
import { SharedWalletTransaction } from '@/modules/shared-wallets/entities/shared-wallet-transaction.entity';
import { SpendingInsight } from '@/modules/ai-insights/entities/spending-insight.entity';
import { Transaction } from '@/modules/wallet/entities/transaction.entity';
import { TransactionSignature } from '@/modules/shared-wallets/entities/transaction-signature.entity';
import { Transfer } from '@/modules/transfers/entities/transfer.entity';
import { User } from '@/modules/users/entities/user.entity';
import { UserReward } from '@/modules/rewards/entities/user-reward.entity';
import { Wallet } from '@/modules/wallet/entities/wallet.entity';

export const ENTITIES = [
  BankDowntime,
  Bill,
  BillPayment,
  BillSplit,
  BillSplitParticipant,
  BudgetRecommendation,
  CrowdfundingCampaign,
  CrowdfundingContribution,
  Escrow,
  EscrowParticipant,
  LedgerEntry,
  Notification,
  ReconciliationRecord,
  RecurringPayment,
  Reward,
  RewardRule,
  ScheduledTransfer,
  SharedWallet,
  SharedWalletMember,
  SharedWalletTransaction,
  SpendingInsight,
  Transaction,
  TransactionSignature,
  Transfer,
  User,
  UserReward,
  Wallet,
];
