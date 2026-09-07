import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ENTITIES } from '@/modules/database/entities';
import { MIGRATIONS } from '@/modules/database/migrations';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isDev = this.configService.get('NODE_ENV') === 'development';

    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),

      /**
       * All 27 entities, from a single explicit list.
       *
       * The original config named only six while eleven modules injected
       * repositories for the rest, so Nest threw during module initialisation and
       * the app never served a request. A glob looks like the obvious fix but
       * cannot work here — `nest build` bundles into one `dist/main.js`, so
       * `__dirname` is `dist/` at runtime and the glob resolves back to the
       * TypeScript sources. `entities.spec.ts` guards the list against drift.
       */
      entities: ENTITIES,
      /**
       * Explicit, for the same reason as ENTITIES above. A glob here silently
       * resolved to nothing in the bundled build, so `migrationsRun` reported
       * success against an empty database and every query then failed with
       * `relation "users" does not exist`.
       */
      migrations: MIGRATIONS,

      // Local development builds the schema straight from the entities so a fresh
      // database is usable immediately. Production runs the migrations instead.
      synchronize: isDev,
      migrationsRun: !isDev,

      ssl: isDev ? false : { rejectUnauthorized: false },
      logging: isDev,
    };
  }
}
