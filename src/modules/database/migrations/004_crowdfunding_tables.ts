import { MigrationInterface, QueryRunner } from 'typeorm';

export class CrowdfundingTables1703004000000 implements MigrationInterface {
  name = 'CrowdfundingTables1703004000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crowdfunding campaigns table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "crowdfunding_campaigns" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" varchar NOT NULL,
        "description" text NOT NULL,
        "targetAmount" decimal(15,2) NOT NULL,
        "raisedAmount" decimal(15,2) DEFAULT 0,
        "status" varchar DEFAULT 'active',
        "shareableLink" varchar NOT NULL,
        "endDate" timestamp NOT NULL,
        "metadata" jsonb,
        "creatorId" uuid NOT NULL,
        "walletId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE
      )
    `);

    // Crowdfunding contributions table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "crowdfunding_contributions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "amount" decimal(15,2) NOT NULL,
        "message" varchar,
        "isAnonymous" boolean DEFAULT false,
        "reference" varchar NOT NULL,
        "contributorId" uuid NOT NULL,
        "campaignId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("contributorId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("campaignId") REFERENCES "crowdfunding_campaigns"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "crowdfunding_contributions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "crowdfunding_campaigns"`);
  }
}