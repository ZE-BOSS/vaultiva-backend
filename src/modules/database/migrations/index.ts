/**
 * Every migration, imported explicitly and in order.
 *
 * A glob cannot be used for the same reason it cannot be used for entities:
 * `nest build` bundles the app into a single `dist/main.js`, so at runtime
 * `__dirname` is `dist/` and a relative glob points at source files that are not
 * part of the deployment bundle. TypeORM then finds zero migrations, reports
 * success, and the application starts against an empty database — which is
 * exactly what happened on the first AWS deploy: every query failed with
 * `relation "users" does not exist`.
 */
import { InitialSchema1703001000000 } from './001_initial_schema';
import { EscrowTables1703002000000 } from './002_escrow_tables';
import { BillSplittingTables1703003000000 } from './003_bill_splitting_tables';
import { CrowdfundingTables1703004000000 } from './004_crowdfunding_tables';
import { SharedWalletsTables1703005000000 } from './005_shared_wallets_tables';
import { AiInsightsTables1703006000000 } from './006_ai_insights_tables';
import { RewardsTables1703007000000 } from './007_rewards_tables';
import { LedgerTables1703008000000 } from './008_ledger_tables';
import { TransfersTables1703009000000 } from './009_transfers_tables';
import { RecurringPaymentsTable1703010000000 } from './010_recurring_payments_table';

export const MIGRATIONS = [
  InitialSchema1703001000000,
  EscrowTables1703002000000,
  BillSplittingTables1703003000000,
  CrowdfundingTables1703004000000,
  SharedWalletsTables1703005000000,
  AiInsightsTables1703006000000,
  RewardsTables1703007000000,
  LedgerTables1703008000000,
  TransfersTables1703009000000,
  RecurringPaymentsTable1703010000000,
];
