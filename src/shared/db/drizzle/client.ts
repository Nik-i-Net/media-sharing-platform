import { ENV } from '@/shared/env.loader';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  user: ENV.POSTGRES_USER,
  password: ENV.POSTGRES_PASSWORD,
  host: ENV.POSTGRES_HOST,
  port: Number(ENV.POSTGRES_PORT),
  database: ENV.POSTGRES_DB,
});

export const db = drizzle(pool, {
  schema, //
  casing: 'snake_case',
  // logger: true,
});
