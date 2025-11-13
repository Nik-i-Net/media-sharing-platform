import type { Knex } from 'knex';

const config: Knex.Config = {
  client: 'pg',
  connection: {
    connectionString: process.env.DB_URL!,
  },
  migrations: {
    directory: './migrations',
    extension: 'ts',
  },
};

export default config;
