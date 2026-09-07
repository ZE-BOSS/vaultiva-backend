import { DataSource } from 'typeorm';
import { config as loadEnv } from 'dotenv';
import { join } from 'path';

// The TypeORM CLI boots this file directly, outside the Nest DI container, so
// nothing has loaded .env yet — ConfigService alone would read undefined.
loadEnv();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [join(__dirname, '/../../**/*.entity{.ts,.js}')],
  // The migrations live here, in `src/modules/database/migrations`. This
  // previously pointed at `src/database/migrations`, which does not exist, so
  // `migration:run` found nothing and reported success.
  migrations: [join(__dirname, '/migrations/*{.ts,.js}')],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
