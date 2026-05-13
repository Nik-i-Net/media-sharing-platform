import { defineConfig } from 'drizzle-kit';
import { loadEnvFile } from 'node:process';
loadEnvFile('./.env.development');

const user = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;
const host = process.env.POSTGRES_HOST;
const port = Number(process.env.POSTGRES_PORT);
const database = process.env.POSTGRES_DB;

export default defineConfig({
  out: './drizzle',
  schema: './src/shared/persistence/drizzle/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: `postgres://${user}:${password}@${host}:${port}/${database}`,
  },
});
