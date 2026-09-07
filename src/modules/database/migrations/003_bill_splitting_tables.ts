import { MigrationInterface, QueryRunner } from 'typeorm';

export class BillSplittingTables1703003000000 implements MigrationInterface {
  name = 'BillSplittingTables1703003000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Bill splits table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "bill_splits" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" varchar NOT NULL,
        "description" text NOT NULL,
        "totalAmount" decimal(15,2) NOT NULL,
        "type" varchar NOT NULL,
        "frequency" varchar NOT NULL,
        "status" varchar DEFAULT 'pending',
        "reference" varchar NOT NULL,
        "nextExecutionDate" timestamp,
        "schedule" jsonb,
        "metadata" jsonb,
        "creatorId" uuid NOT NULL,
        "walletId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE
      )
    `);

    // Bill split participants table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "bill_split_participants" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "role" varchar NOT NULL,
        "status" varchar DEFAULT 'invited',
        "amount" decimal(15,2) NOT NULL,
        "lastPaymentDate" timestamp,
        "nextReminderDate" timestamp,
        "userId" uuid NOT NULL,
        "walletId" uuid NOT NULL,
        "billSplitId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE,
        FOREIGN KEY ("billSplitId") REFERENCES "bill_splits"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "bill_split_participants"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "bill_splits"`);
  }
}