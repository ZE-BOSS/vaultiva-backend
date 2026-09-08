import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Gives `wallets` somewhere to record the real bank account behind it.
 *
 * Without these columns a wallet was a local ledger row and nothing more: no
 * account number meant no way for anyone to send money into it, and the app's
 * wallet card had nothing to display. Xpress Wallet returns all of this when a
 * customer wallet is opened.
 */
export class WalletBankAccount1703012000000 implements MigrationInterface {
  name = 'WalletBankAccount1703012000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "wallets" ADD COLUMN IF NOT EXISTS "accountNumber" character varying`);
    await queryRunner.query(`ALTER TABLE "wallets" ADD COLUMN IF NOT EXISTS "accountName" character varying`);
    await queryRunner.query(`ALTER TABLE "wallets" ADD COLUMN IF NOT EXISTS "bankName" character varying`);
    await queryRunner.query(`ALTER TABLE "wallets" ADD COLUMN IF NOT EXISTS "bankCode" character varying`);
    await queryRunner.query(`ALTER TABLE "wallets" ADD COLUMN IF NOT EXISTS "providerWalletId" character varying`);
    // One provider wallet maps to exactly one local wallet.
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_wallets_providerWalletId" ON "wallets" ("providerWalletId") WHERE "providerWalletId" IS NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_wallets_providerWalletId"`);
    for (const col of ['providerWalletId', 'bankCode', 'bankName', 'accountName', 'accountNumber']) {
      await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN IF EXISTS "${col}"`);
    }
  }
}
