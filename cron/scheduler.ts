import { R2StorageProvider } from '@/features/uploads/infrastructure/R2-storage.provider';
import * as schema from '@/shared/db/drizzle/schema';
import { ENV } from '@/shared/env.loader';
import { drizzle } from 'drizzle-orm/node-postgres';
import { schedule } from 'node-cron';
import { Pool } from 'pg';
import pino from 'pino';
import { deletePendingBlobsJob } from './jobs/delete-pending-blobs.job';
import { deleteRejectedBlobsJob } from './jobs/delete-rejected-blobs.job';
import { deleteUnusedBlobsJob } from './jobs/delete-unused-blobs.job';

const pool = new Pool({
  user: ENV.POSTGRES_USER,
  password: ENV.POSTGRES_PASSWORD,
  host: ENV.POSTGRES_HOST,
  port: Number(ENV.POSTGRES_PORT),
  database: ENV.POSTGRES_DB,
  max: 2,
});

const db = drizzle(pool, {
  schema, //
  casing: 'snake_case',
});

const storageProvider = new R2StorageProvider({
  accountId: ENV.CLOUDFLARE_ACCOUNT_ID,
  accessKeyId: ENV.CLOUDFLARE_ACCESS_KEY_ID,
  secretAccessKey: ENV.CLOUDFLARE_SECRET_ACCESS_KEY,
  bucket: ENV.CLOUDFLARE_BUCKET,
  downloadBaseUrl: ENV.MEDIA_BASE_URL,
});

const cronLogger = pino({}, pino.destination('cron/cron.log'));

// Every day at 10:00
schedule('0 0 10 * * *', async () => {
  const job = 'delete-pending-blobs';
  cronLogger.info(`Running cron job: ${job}`);

  await deletePendingBlobsJob(db, cronLogger.child({ job }));
  cronLogger.info(`Finished job: ${job}`);
});

// First day of every month at 10:00
schedule('0 0 10 1 * *', async () => {
  const job = 'delete-rejected-blobs';
  cronLogger.info(`Running cron job: ${job}`);

  await deleteRejectedBlobsJob(db, cronLogger.child({ job }));
  cronLogger.info(`Finished job: ${job}`);
});

// First day of every month at 11:00
schedule('0 0 11 1 * *', async () => {
  const job = 'delete-unused-blobs';
  cronLogger.info(`Running cron job: ${job}`);

  await deleteUnusedBlobsJob(db, storageProvider, cronLogger.child({ job }));
  cronLogger.info(`Finished job: ${job}`);
});

let shuttingDown = false;

async function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;

  try {
    await pool.end();
  } finally {
    process.exit(0);
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
