import { MigrationInterface, QueryRunner } from 'typeorm';

export class SharedWalletsTables1703005000000 implements MigrationInterface {
  name = 'SharedWalletsTables1703005000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Shared wallets table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "shared_wallets" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar NOT NULL,
        "description" text,
        "mode" varchar NOT NULL,
        "status" varchar DEFAULT 'active',
        "requiredSignatures" int DEFAULT 1,
        "rules" jsonb,
        "metadata" jsonb,
        "creatorId" uuid NOT NULL,
        "walletId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE
      )
    `);

    // Shared wallet members table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "shared_wallet_members" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "role" varchar NOT NULL,
        "status" varchar DEFAULT 'invited',
        "spendingLimit" decimal(15,2),
        "permissions" jsonb,
        "joinedAt" timestamp,
        "userId" uuid NOT NULL,
        "sharedWalletId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("sharedWalletId") REFERENCES "shared_wallets"("id") ON DELETE CASCADE
      )
    `);

    // Shared wallet transactions table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "shared_wallet_transactions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "amount" decimal(15,2) NOT NULL,
        "type" varchar NOT NULL,
        "status" varchar DEFAULT 'pending',
        "reference" varchar NOT NULL,
        "description" varchar,
        "metadata" jsonb,
        "initiatorId" uuid NOT NULL,
        "sharedWalletId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("initiatorId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("sharedWalletId") REFERENCES "shared_wallets"("id") ON DELETE CASCADE
      )
    `);

    // Transaction signatures table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "transaction_signatures" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "status" varchar DEFAULT 'pending',
        "comment" varchar,
        "signerId" uuid NOT NULL,
        "transactionId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        FOREIGN KEY ("signerId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("transactionId") REFERENCES "shared_wallet_transactions"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "transaction_signatures"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "shared_wallet_transactions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "shared_wallet_members"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "shared_wallets"`);
  }
}