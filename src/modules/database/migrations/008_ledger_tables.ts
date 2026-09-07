import { MigrationInterface, QueryRunner } from 'typeorm';

export class LedgerTables1703008000000 implements MigrationInterface {
  name = 'LedgerTables1703008000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ledger entries table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "ledger_entries" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "reference" varchar NOT NULL,
        "type" varchar NOT NULL,
        "amount" decimal(15,2) NOT NULL,
        "fee" decimal(15,2) DEFAULT 0,
        "description" varchar NOT NULL,
        "provider" varchar NOT NULL,
        "providerReference" varchar,
        "status" varchar NOT NULL,
        "userId" uuid NOT NULL,
        "walletId" uuid,
        "transactionId" uuid,
        "metadata" jsonb,
        "reconciledAt" timestamp,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);

    // Create indexes for better performance
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ledger_user_created" ON "ledger_entries" ("userId", "createdAt")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ledger_provider_ref" ON "ledger_entries" ("provider", "providerReference")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_ledger_reference" ON "ledger_entries" ("reference")`);

    // Reconciliation records table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "reconciliation_records" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "type" varchar NOT NULL,
        "status" varchar NOT NULL,
        "reconciliationDate" date NOT NULL,
        "totalEntries" int DEFAULT 0,
        "reconciledEntries" int DEFAULT 0,
        "discrepancies" int DEFAULT 0,
        "totalAmount" decimal(15,2) DEFAULT 0,
        "discrepancyDetails" jsonb,
        "performedBy" varchar,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ledger_reference"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ledger_provider_ref"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ledger_user_created"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "reconciliation_records"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "ledger_entries"`);
  }
}