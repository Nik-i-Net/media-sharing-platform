import knex, { type Knex } from 'knex';
import knexConfig from 'src/@config/knexfile.js';
import type { UserRecord, InsertUserRecord, UpdateUserRecord } from './records/user.record.js';

const db = knex(knexConfig);

declare module 'knex/types/tables.js' {
  interface Tables {
    users: Knex.CompositeTableType<UserRecord, InsertUserRecord, UpdateUserRecord>;
  }
}

export default db;
