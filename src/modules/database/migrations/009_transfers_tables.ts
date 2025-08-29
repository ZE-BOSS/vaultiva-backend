import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransfersTables1703009000000 implements MigrationInterface {
  name = 'TransfersTables1703009000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Transfers table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "transfers" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "amount" decimal(15,2) NOT NULL,
        "fee" decimal(15,2) DEFAULT 0,
        "type" varchar NOT NULL,
        "status" varchar DEFAULT 'pending',
        "reference" varchar NOT NULL,
        "providerReference" varchar,
        "description" varchar NOT NULL,
        "sourceDetails" jsonb NOT NULL,
        "destinationDetails" jsonb NOT NULL,
        "metadata" jsonb,
        "failureReason" varchar,
        "userId" uuid NOT NULL,
        "sourceWalletId" uuid,
        "destinationWalletId" uuid,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("sourceWalletId") REFERENCES "wallets"("id") ON DELETE SET NULL,
        FOREIGN KEY ("destinationWalletId") REFERENCES "wallets"("id") ON DELETE SET NULL
      )
    `);

    // Scheduled transfers table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "scheduled_transfers" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar NOT NULL,
        "amount" decimal(15,2) NOT NULL,
        "frequency" varchar NOT NULL,
        "status" varchar DEFAULT 'active',
        "nextExecutionDate" timestamp NOT NULL,
        "endDate" timestamp,
        "executionCount" int DEFAULT 0,
        "maxExecutions" int,
        "transferTemplate" jsonb NOT NULL,
        "metadata" jsonb,
        "userId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Bank downtimes table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "bank_downtimes" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "bankCode" varchar NOT NULL,
        "bankName" varchar NOT NULL,
        "type" varchar NOT NULL,
        "status" varchar NOT NULL,
        "title" varchar NOT NULL,
        "description" text NOT NULL,
        "startTime" timestamp NOT NULL,
        "estimatedEndTime" timestamp,
        "actualEndTime" timestamp,
        "affectedServices" jsonb,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "bank_downtimes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "scheduled_transfers"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "transfers"`);
  }
}