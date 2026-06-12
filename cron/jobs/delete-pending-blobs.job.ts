import * as schema from '@/shared/db/drizzle/schema';
import { and, eq, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Logger } from 'pino';

const { blobsTable } = schema;

// TODO: add `Object lifecycle rules` to R2
export async function deletePendingBlobsJob(
  db: NodePgDatabase<typeof schema>, //
  logger: Logger,
) {
  try {
    const { rowCount } = await db.delete(blobsTable).where(
      and(
        eq(blobsTable.status, 'pending'), //
        sql`${blobsTable.createdAt} < NOW() - INTERVAL '1 day'`,
      ),
    );

    logger.info({ deleted: rowCount ?? 0 }, 'Deleted pending blobs');
  } catch (err) {
    logger.error({ err });
  }
}
