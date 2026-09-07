import { MigrationInterface, QueryRunner } from 'typeorm';

export class RewardsTables1703007000000 implements MigrationInterface {
  name = 'RewardsTables1703007000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rewards table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "rewards" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar NOT NULL,
        "description" text NOT NULL,
        "type" varchar NOT NULL,
        "category" varchar NOT NULL,
        "value" decimal(5,2) NOT NULL,
        "conditions" jsonb NOT NULL,
        "isActive" boolean DEFAULT true,
        "validFrom" timestamp,
        "validUntil" timestamp,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);

    // User rewards table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_rewards" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "amount" decimal(15,2) NOT NULL,
        "status" varchar DEFAULT 'earned',
        "reference" varchar NOT NULL,
        "metadata" jsonb,
        "redeemedAt" timestamp,
        "expiresAt" timestamp,
        "userId" uuid NOT NULL,
        "rewardId" uuid,
        "transactionId" uuid,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("rewardId") REFERENCES "rewards"("id") ON DELETE SET NULL,
        FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE SET NULL
      )
    `);

    // Reward rules table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "reward_rules" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar NOT NULL,
        "type" varchar NOT NULL,
        "conditions" jsonb NOT NULL,
        "rewards" jsonb NOT NULL,
        "isActive" boolean DEFAULT true,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "reward_rules"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_rewards"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "rewards"`);
  }
}