import { DataSource } from 'typeorm';
import { config as loadEnv } from 'dotenv';
import { join } from 'path';
import { MIGRATIONS } from './migrations';

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
  /**
   * The same explicit list the app uses. A glob here matched both each migration
   * file and the barrel that re-exports them, so every migration was discovered
   * twice and the CLI aborted with "Duplicate migrations".
   */
  migrations: MIGRATIONS,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
