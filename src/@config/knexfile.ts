import type { Knex } from 'knex';
import { postProcessResponse, wrapIdentifier } from '../infrastructure/persistence/knex-utils';
import { env } from './env.loader';

const knexConfig: Knex.Config = {
  client: 'pg',
  connection: {
    connectionString: env.DB_URL,
  },
  migrations: {
    directory: '../../migrations/',
    extension: 'ts',
  },
  wrapIdentifier,
  postProcessResponse,
};

export default knexConfig;
