import { Pool } from 'pg';
import { drizzle, NodePgDatabase, type NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import { ENV } from '@/shared/env.loader';

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

export type DrizzleDB = NodePgDatabase<typeof schema>;
export type DrizzleTransaction = PgTransaction<
  NodePgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;
