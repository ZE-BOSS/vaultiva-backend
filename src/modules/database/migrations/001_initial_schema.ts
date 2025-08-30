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

    // Bills table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "bills" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar NOT NULL,
        "billerCode" varchar NOT NULL,
        "itemCode" varchar NOT NULL,
        "category" varchar NOT NULL,
        "provider" varchar NOT NULL,
        "fee" decimal(10,2) NOT NULL,
        "minimumAmount" decimal(10,2),
        "maximumAmount" decimal(10,2),
        "isActive" boolean DEFAULT true,
        "hasDowntime" boolean DEFAULT false,
        "downtimeStart" timestamp,
        "downtimeEnd" timestamp,
        "metadata" jsonb,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);

    // Bill payments table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "bill_payments" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "amount" decimal(15,2) NOT NULL,
        "customer" varchar NOT NULL,
        "status" varchar DEFAULT 'pending',
        "reference" varchar NOT NULL,
        "providerReference" varchar,
        "failureReason" varchar,
        "metadata" jsonb,
        "userId" uuid NOT NULL,
        "billId" uuid NOT NULL,
        "walletId" uuid NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("billId") REFERENCES "bills"("id") ON DELETE CASCADE,
        FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE
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