import { MigrationInterface, QueryRunner } from 'typeorm';

export class EscrowTables1703002000000 implements MigrationInterface {
  name = 'EscrowTables1703002000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Escrows table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "escrows" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" varchar NOT NULL,
        "description" text NOT NULL,
        "amount" decimal(15,2) NOT NULL,
        "type" varchar NOT NULL,
        "mode" varchar NOT NULL,
        "status" varchar DEFAULT 'pending',
        "reference" varchar NOT NULL,
        "releaseDate" timestamp NOT NULL,
        "conditions" jsonb,
        "metadata" jsonb,
        "creatorId" uuid NOT NULL,
        "walletId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE
      )
    `);

    // Escrow participants table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "escrow_participants" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "role" varchar NOT NULL,
        "status" varchar DEFAULT 'invited',
        "contributionAmount" decimal(15,2),
        "acceptedAt" timestamp,
        "userId" uuid NOT NULL,
        "escrowId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("escrowId") REFERENCES "escrows"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "escrow_participants"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "escrows"`);
  }
}