import type { Knex } from 'knex';
import { postProcessResponse, wrapIdentifier } from '../infrastructure/persistence/knex-utils';
import { ENV } from './env.loader';

const knexConfig: Knex.Config = {
  client: 'pg',
  connection: {
    user: ENV.POSTGRES_USER,
    password: ENV.POSTGRES_PASSWORD,
    host: ENV.POSTGRES_HOST,
    port: Number(ENV.POSTGRES_PORT),
    database: ENV.POSTGRES_DB,
  },
  migrations: {
    directory: '../../migrations/',
    extension: 'ts',
  },
  wrapIdentifier,
  postProcessResponse,
};

export default knexConfig;
