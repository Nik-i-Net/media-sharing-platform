import knex, { type Knex } from 'knex';
import config from './knexfile.js';
import type { User, UserInsert, UserUpdate } from '@modules/users/user.entity.js';

const db = knex(config);

declare module 'knex/types/tables.js' {
  interface Tables {
    users: Knex.CompositeTableType<User, UserInsert, UserUpdate>;
  }
}

export default db;
