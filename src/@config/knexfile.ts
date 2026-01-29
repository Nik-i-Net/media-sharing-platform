import { wrapIdentifier, postProcessResponse } from '@shared/infrastructure/persistence/knex-utils.js';
import type { Knex } from 'knex';

if (!process.env.DB_URL) {
  throw new Error('[env] DB_URL is missing');
}

const knexConfig: Knex.Config = {
  client: 'pg',
  connection: {
    connectionString: process.env.DB_URL,
  },
  migrations: {
    directory: '../../../migrations/',
    extension: 'ts',
  },
  wrapIdentifier,
  postProcessResponse,
};

export default knexConfig;
