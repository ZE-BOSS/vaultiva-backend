import { MigrationInterface, QueryRunner } from 'typeorm';

export class AiInsightsTables1703006000000 implements MigrationInterface {
  name = 'AiInsightsTables1703006000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Spending insights table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "spending_insights" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "type" varchar NOT NULL,
        "priority" varchar NOT NULL,
        "title" varchar NOT NULL,
        "description" text NOT NULL,
        "recommendation" text NOT NULL,
        "data" jsonb NOT NULL,
        "isRead" boolean DEFAULT false,
        "isActioned" boolean DEFAULT false,
        "userId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Budget recommendations table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "budget_recommendations" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "type" varchar NOT NULL,
        "category" varchar NOT NULL,
        "currentSpending" decimal(15,2) NOT NULL,
        "recommendedSpending" decimal(15,2) NOT NULL,
        "potentialSavings" decimal(15,2) NOT NULL,
        "explanation" text NOT NULL,
        "actionItems" jsonb NOT NULL,
        "isImplemented" boolean DEFAULT false,
        "userId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "budget_recommendations"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "spending_insights"`);
  }
}