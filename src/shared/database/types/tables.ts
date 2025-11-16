import type { UsersTable } from './users.table.js';

declare module 'knex/types/tables.js' {
  interface Tables {
    users: UsersTable;
  }
}
