import type { Knex } from 'knex';

if (!process.env.DB_URL) {
  throw new Error('[env] DB_URL is missing');
}

const config: Knex.Config = {
  client: 'pg',
  connection: {
    connectionString: process.env.DB_URL,
  },
  migrations: {
    directory: '../../../migrations/',
    extension: 'ts',
  },
};

export default config;
