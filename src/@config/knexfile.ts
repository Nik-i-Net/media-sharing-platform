import type { Knex } from 'knex';
import { postProcessResponse, wrapIdentifier } from '../infrastructure/persistence/knex-utils';
import { env } from './env.loader';

const knexConfig: Knex.Config = {
  client: 'pg',
  connection: {
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    host: env.POSTGRES_HOST,
    port: Number(env.POSTGRES_PORT),
    database: env.POSTGRES_DB,
  },
  migrations: {
    directory: '../../migrations/',
    extension: 'ts',
  },
  wrapIdentifier,
  postProcessResponse,
};

export default knexConfig;
