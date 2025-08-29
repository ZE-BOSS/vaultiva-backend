import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1703001000000 implements MigrationInterface {
  name = 'InitialSchema1703001000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Users table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" varchar UNIQUE NOT NULL,
        "username" varchar UNIQUE,
        "password" varchar,
        "firstName" varchar,
        "lastName" varchar,
        "bvn" bigint,
        "nin" bigint,
        "accountNumber" bigint,
        "bank" varchar,
        "accountName" varchar,
        "address" varchar,
        "dateOfBirth" varchar,
        "biometricPublicKey" text,
        "phone" varchar UNIQUE,
        "role" varchar DEFAULT 'user',
        "codes" jsonb DEFAULT '[]',
        "isActive" boolean DEFAULT true,
        "isEmailVerified" boolean DEFAULT false,
        "isPhoneVerified" boolean DEFAULT false,
        "kycStatus" varchar DEFAULT 'not_started',
        "lastLoginAt" timestamp,
        "loginDevice" varchar,
        "pin" varchar,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);

    // Wallets table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "wallets" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "customerId" varchar NOT NULL,
        "balance" decimal(15,2) DEFAULT 0,
        "type" varchar DEFAULT 'main',
        "name" varchar NOT NULL,
        "currency" varchar DEFAULT 'NGN',
        "isActive" boolean DEFAULT true,
        "userId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Transactions table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "transactions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "amount" decimal(15,2) NOT NULL,
        "type" varchar NOT NULL,
        "status" varchar DEFAULT 'pending',
        "reference" varchar NOT NULL,
        "description" varchar,
        "metadata" jsonb,
        "providerReference" varchar,
        "failureReason" varchar,
        "userId" uuid NOT NULL,
        "walletId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE
      )
    `);

    // Notifications table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "notifications" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" varchar NOT NULL,
        "message" text NOT NULL,
        "type" varchar NOT NULL,
        "channel" varchar NOT NULL,
        "isRead" boolean DEFAULT false,
        "metadata" jsonb,
        "userId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "notifications"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "transactions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "wallets"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}