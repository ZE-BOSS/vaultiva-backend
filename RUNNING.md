# Running Vaultiva backend locally

## Prerequisites

- Node 20+ (Node 24 works)
- PostgreSQL 16+ and Redis

**Docker is not an option on this machine** — Docker Desktop needs hardware
virtualisation and it is disabled in BIOS. PostgreSQL and Redis both run fine
without it, so the setup below uses them directly. `docker-compose.yml` is kept
for machines where Docker *is* available, and for deployment.

## Database — one-time setup

```bash
powershell -ExecutionPolicy Bypass -File scripts/local-postgres.ps1 setup
```

That downloads the official PostgreSQL Windows binaries into
`C:\Users\<you>\pgsql` (no installer, no admin rights) and initialises a cluster.

Then, each time you want the database up:

```bash
powershell -ExecutionPolicy Bypass -File scripts/local-postgres.ps1 start
```

```bash
powershell -ExecutionPolicy Bypass -File scripts/local-postgres.ps1 reset
```

`reset` drops and recreates `vaultiva_db` — run it on first start, and whenever
you want a clean schema. `stop` and `status` do what they say.

> **Why the short path matters.** The first attempt ran Postgres from a long
> temp directory and every forked backend died with `0xC0000142`
> (STATUS_DLL_INIT_FAILED) plus *"could not reserve shared memory region … error
> code 487"*. The server started but refused every connection. Running from
> `C:\Users\<you>\pgsql` fixes it. Don't relocate it somewhere deep.

## Redis

Redis is already running on this machine on port 6379. Check with:

```bash
netstat -ano | findstr :6379
```

If it is not running, any Windows Redis build or Memurai works; the app only uses
it for BullMQ queues and will boot without it (queue-backed flows will not run).

## Environment

Fill in the blank credential fields in `.env` — it is gitignored and already has
working local defaults plus generated JWT and encryption secrets. The app starts
without them and logs one warning per unconfigured integration; only endpoints
that actually call that provider fail, and they now fail with an actionable
message rather than a 500.

## Run

```bash
npm install
```

```bash
npm run start:dev
```

Swagger is at http://localhost:3000/docs and the API is under `/api/v1`.

## What a good start looks like

One `WARN [Config]` line per unconfigured integration, then `InstanceLoader`
lines for every module, then:

```
LOG [NestFactory] Application is running on: http://localhost:3000
```

If it stops at `Unable to connect to the database. Retrying (1)...` the Postgres
helper is not running. If it stops with `Nest can't resolve dependencies of X`, an
entity is injected via `@InjectRepository` but missing from
`src/modules/database/entities.ts` — `npm test` catches that.

## Schema

`NODE_ENV=development` uses `synchronize: true`, so the schema is built from the
entities on boot; no migration step is needed locally. Production sets
`migrationsRun: true` and `synchronize: false`.

## Smoke test

```bash
curl http://localhost:3000/api/v1/health
```

Registration is passwordless at step one. With ZeptoMail/Termii unconfigured the
verification code is not sent anywhere — read it from the database:

```bash
curl -X POST http://localhost:3000/api/v1/auth/register -H "Content-Type: application/json" -d "{\"email\":\"you@example.com\"}"
```

```sql
select codes from users where email = 'you@example.com';
```

Then `POST /auth/verify-code`, `POST /auth/complete-profile` (which issues a token
and creates the first wallet), and `POST /auth/login`.

## Tests

```bash
npm test
```

Six suites, 25 tests, no database required. `entities.spec.ts` fails the build if
an `@Entity` is added without registering it.

## Note on the vendored Flutterwave client

`.api/apis/flutterwave-v3` is generated source vendored into the repo. It is
resolved through the `@api/flutterwave-v3` path mapping in `tsconfig.json` and
compiled with the project, rather than installed as a `file:` dependency — its
`package.json` names a `.ts` file as `main`, which Node cannot load once webpack
externalises it. Do not re-add it to `dependencies`.
