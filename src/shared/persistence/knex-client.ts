import knexConfig from '@/config/knexfile';
import knex from 'knex';

const db = knex(knexConfig);

export default db;
