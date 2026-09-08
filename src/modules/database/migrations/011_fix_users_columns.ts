import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Realigns `users` with the entity.
 *
 * Development builds the schema with `synchronize: true` from the entities;
 * production runs these migrations. The two had drifted, and the difference was
 * invisible locally:
 *
 *   - `email` was NOT NULL, but registration accepts *either* an email or a
 *     phone number. Signing up with a phone inserted `email = null` and the
 *     request failed with a 500 —
 *     `null value in column "email" of relation "users" violates not-null
 *     constraint`. Registration by phone was impossible in production.
 *
 *   - `bvn`, `nin` and `accountNumber` were `bigint`. All three are fixed-length
 *     identifiers that can begin with a zero, and a numeric column silently
 *     discards it: NIN `01234567890` reads back as `1234567890`, which is a
 *     different, invalid number. The entity types them as strings.
 *
 * Comparing table *names* between the two schemas is not enough to catch this —
 * both had all 27 tables. Column type and nullability have to be compared.
 */
export class FixUsersColumns1703011000000 implements MigrationInterface {
  name = 'FixUsersColumns1703011000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Registration supplies an email or a phone number, never necessarily both.
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`);

    // Identifiers, not quantities. USING casts whatever is already stored.
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "bvn" TYPE character varying USING "bvn"::character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "nin" TYPE character varying USING "nin"::character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "accountNumber" TYPE character varying USING "accountNumber"::character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverting the numeric types would corrupt any identifier with a leading
    // zero, so only the constraint is restored — and only if the data allows it.
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "accountNumber" TYPE bigint USING NULLIF("accountNumber", '')::bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "nin" TYPE bigint USING NULLIF("nin", '')::bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "bvn" TYPE bigint USING NULLIF("bvn", '')::bigint`,
    );
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`);
  }
}
