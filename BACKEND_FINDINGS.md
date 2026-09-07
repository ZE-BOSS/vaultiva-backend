# Backend findings — blockers found before first local run

Recorded 2026-09-04. The backend had no `.env` and has evidently never been booted.
These four defects are why. All are fixed in the backend phase; none are fixed yet.

---

## 1. `DatabaseConfig` reads a `DB_PUBLIC_*` prefix that nothing defines — BLOCKING

`src/config/database.config.ts:18` sets `private DB_PREFIX = 'DB_PUBLIC'` and reads
`DB_PUBLIC_HOST`, `DB_PUBLIC_PORT`, `DB_PUBLIC_USERNAME`, `DB_PUBLIC_PASSWORD`,
`DB_PUBLIC_NAME`. The old `.env.example` defined only `DB_HOST`, `DB_PORT`, … so every
connection parameter resolved to `undefined` and TypeORM would fall back to libpq
defaults (or fail outright).

Meanwhile `src/modules/database/data-source.ts` — used by the `migration:*` scripts —
reads the *un*prefixed `DB_*` names. So the app and the migration runner read two
different sets of variables.

**Interim mitigation:** `.env` now defines both sets with identical values.
**Real fix:** settle on `DB_*`, drop the prefix indirection.

## 2. Only 6 of 27 entities are registered on the connection — BLOCKING

`src/config/database.config.ts:26` lists just `User, Wallet, Transaction, Bill,
BillPayment, Notification`. The codebase defines **27** `@Entity` classes, and 11
modules call `TypeOrmModule.forFeature([...])` with entities absent from that list —
escrow, bill-splitting, crowdfunding, shared-wallets, ai-insights, rewards, ledger,
transfers, recurring-payments.

Nest cannot resolve a `Repository<T>` for an entity that is not on the connection, so
**the app will not boot** — it throws at module init, before any request is served.
With `synchronize: true` in development, those tables would never be created either.

**Fix:** replace the hand-maintained array with a glob
(`entities: [__dirname + '/../**/*.entity{.ts,.js}']`) so it cannot drift again.

## 3. One Flutterwave settlement account, three key spellings — SILENT MISCONFIG

The same logical account is read under three different names, one of them misspelled:

| File | Keys |
|---|---|
| `src/modules/payments/payments.service.ts:44-47` | `FLUTTERWAVE_ACCOUNT_NUMBER`, `FLUTTERWAVE_ACCOUNT_NAME`, `FLUTTERWAVE_BANK_NAME`, `FLUTTERWAVE_BANK_CODE` |
| `src/modules/flutterwave/flutterwave.service.ts:109-112` | `FLUTTER_WAVE_ACCOUNT_NUMBER`, **`FUTTER_WAVE_ACCOUNT_NAME`** (sic), `FLUTTER_WAVE_BANK_NAME`, `FLUTTER_WAVE_BANK_CODE` |

Whichever set is left unset silently yields `undefined` and is sent to Flutterwave as a
malformed payload rather than failing fast.

**Interim mitigation:** `.env` defines all three spellings.
**Real fix:** collapse to `FLUTTERWAVE_*` and validate at boot.

## 4. Migration path points at a directory that does not exist — BLOCKING MIGRATIONS

`src/modules/database/data-source.ts:15` declares `migrations: ['src/database/migrations/*.ts']`.
The ten migration files actually live in `src/modules/database/migrations/`.
`npm run migration:run` therefore finds zero migrations and reports success.

**Fix:** point at `src/modules/database/migrations/*.ts`.

---

## Cross-cutting: no boot-time config validation

Every one of the above fails silently or late. The `ConfigModule.forRoot()` call in
`src/app.module.ts:33` passes no `validationSchema`, so a missing or misspelled
variable surfaces as a runtime `undefined` deep inside a provider call.

**Fix:** add a Joi/Zod schema so the process refuses to start with an incomplete `.env`.

---

# Status — all fixed

Everything above is now fixed, plus five further defects found once the build
started working. `npx nest build` succeeds and the app boots as far as the
database connection (verified: it fails only with `ECONNREFUSED` on Postgres,
having initialised every module and resolved every dependency).

| # | Defect | Fix |
|---|---|---|
| 1 | `DB_PUBLIC_*` prefix nothing defined | `src/config/database.config.ts` reads `DB_*` |
| 2 | 6 of 27 entities registered | resolved by glob, cannot drift |
| 3 | Three Flutterwave key spellings | one spelling, fails fast when unset |
| 4 | Migrations path did not exist | points at `src/modules/database/migrations` |
| 5 | **`auth/dto/create-user.dto.ts` was a raw unified diff saved as `.ts`** — every line prefixed `+`/`-`, so the file did not parse | deleted; it duplicated `users/dto/create-user.dto.ts`, which is what the controller actually uses |
| 6 | **`AuthController` exposed 17 endpoints; `AuthService` implemented 9**, with mismatched signatures and a duplicated `verifyCode` | service rewritten to implement all 17 |
| 7 | **User entity had 8 non-nullable columns with no default** (`bvn`, `nin`, `accountNumber`, `bank`, `accountName`, `address`, `dateOfBirth`, `loginDevice`), so the first INSERT of a signup could never succeed | made nullable; `bvn`/`nin` changed `number` → `string` (11-digit ids can carry leading zeros) |
| 8 | **`.api/apis/flutterwave-v3/openapi.json` was also a saved diff, and an empty stub** (`"paths": {}`) — every `@api/flutterwave-v3` call would fail at runtime | replaced with the real 74-path spec from `flutterwave-v3.json`; also added the missing `https://` on its server URL |
| 9 | `@api` `file:` symlinks pointed at `Documents\vaultiva-backend` — **the repo had been moved** to `Documents\vaultiva\vaultiva-backend` | dependency replaced with a `tsconfig` path mapping so the vendored source compiles with the project |
| 10 | `FlutterwaveService` built the SDK in its constructor, so the whole app refused to start without Flutterwave keys | lazily constructed on first use |
| 11 | `SharedWalletsService` injected `TransactionSignature`, not in `forFeature` | registered |
| 12 | Verification codes ignored their category and were never consumed — one code was replayable indefinitely and across flows | `consumeCode` checks category and expiry, then deletes |

Also added: boot-time config validation (`src/config/env.validation.ts`) that hard
-fails on missing core settings and warns per unconfigured integration;
`tsconfig.build.json` so tests are excluded from the build; `resolveJsonModule`.

---

# Round two — found by actually running it

With Postgres up (no Docker; see RUNNING.md) six more defects surfaced that only
appear at runtime. All fixed and verified against a live database.

| # | Defect | Fix |
|---|---|---|
| 13 | **Entity glob resolved to the TypeScript sources.** `nest build` bundles into one `dist/main.js`, so `__dirname` is `dist/` and `__dirname + '/../**/*.entity{.ts,.js}'` matched `src/**/*.entity.ts`. TypeORM loaded `.ts` files and Node's strip-only mode threw on the first `enum`. | explicit barrel `src/modules/database/entities.ts`, guarded by `entities.spec.ts` |
| 14 | **Duplicate index on `ledger_entries.reference`** — declared both class-level (`@Index(['reference'])`) and column-level (`@Index()`). Both hash to the same name, so `synchronize` issued `CREATE INDEX` twice and schema creation failed outright. | removed the column-level duplicate |
| 15 | **Every paginated list endpoint returned 500** unless `?page=&limit=` were passed explicitly. The global `ValidationPipe` runs `transform: true` with `enableImplicitConversion`, whose `transformPrimitive` does `+value` — for an absent query param that is `NaN`, so the TypeScript default never applied and `NaN` reached TypeORM as `skip`. 26 parameters across 11 controllers. | `PositiveIntPipe`, applied per parameter. `DefaultValuePipe` cannot fix this: global pipes run *before* parameter pipes, so it only ever sees `NaN`, never `undefined`. |
| 16 | **`bill_splits.walletId` is NOT NULL but `CreateBillSplitDto` had no such field**, so every split creation failed with a Postgres not-null violation surfaced as a 500. | added `walletId` to the DTO |
| 17 | **`CreateTransferDto.sourceDetails` / `destinationDetails` carried no class-validator decorator.** With `whitelist: true` they were stripped, and `forbidNonWhitelisted: true` then rejected the request — every transfer 400'd regardless of payload. Same in `CreateScheduledTransferDto.transferTemplate`. | added `@IsObject()` and a typed `TransferPartyDetails` |
| 18 | `GET /bills` returned an opaque 500 when `FLUTTERWAVE_SECRET_KEY` was unset. | now a 503 naming the missing variable |

## Verified working against a live database

- 27 tables created from the entities on first boot
- register → verify-code → complete-profile → login, with the first wallet created
- a used verification code is rejected on replay (400), wrong password 401,
  missing token 401, and neither `password` nor `pin` appears in any response
- 21 GET endpoints return 200 with no query string
- escrow, bill-split and transfer all create successfully
- set-pin / verify-pin, including the wrong-PIN path
- unconfigured providers fail with an actionable message instead of a 500

## Still worth doing

- `UsersService.verifyCode` remains the old category-less, non-consuming version.
  Nothing uses it now — `AuthService` has its own — but it should be removed or
  fixed before someone calls it.
- `test/*.e2e-spec.ts` were written against the old auth surface and have not been
  re-verified against a live database.
- The bill-split model is participant-based (`userId` + `walletId` per person)
  while the mobile design collects a receiver account number and bank. The mobile
  screen currently creates the split with the signed-in user as sole sender and
  carries the receiver details in `metadata`; a proper invite-by-account-number
  path needs a backend decision.
- No transfer has been executed against real Flutterwave/Xpress sandboxes yet —
  the credentials are still blank.
