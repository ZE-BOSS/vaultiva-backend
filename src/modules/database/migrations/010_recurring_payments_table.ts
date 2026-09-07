import { MigrationInterface, QueryRunner } from 'typeorm';

export class RecurringPaymentsTable1703010000000 implements MigrationInterface {
  name = 'RecurringPaymentsTable1703010000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Recurring payments table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "recurring_payments" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" uuid NOT NULL,
        "transactionId" uuid NOT NULL,
        "amount" decimal(15,2) NOT NULL,
        "duration" int NOT NULL,
        "frequency" varchar NOT NULL,
        "status" varchar DEFAULT 'active',
        "startDate" date NOT NULL,
        "metadata" jsonb,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "recurring_payments"`);
  }
}