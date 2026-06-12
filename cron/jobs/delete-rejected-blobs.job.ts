import * as schema from '@/shared/db/drizzle/schema';
import { and, eq, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Logger } from 'pino';

const { blobsTable } = schema;

// TODO: autoremove rejected objects from R2
export async function deleteRejectedBlobsJob(
  db: NodePgDatabase<typeof schema>, //
  logger: Logger,
) {
  try {
    const { rowCount } = await db.delete(blobsTable).where(
      and(
        eq(blobsTable.status, 'rejected'), //
        sql`${blobsTable.createdAt} < NOW() - INTERVAL '30 days'`,
      ),
    );

    logger.info({ deleted: rowCount ?? 0 }, 'Deleted rejected blobs');
  } catch (err) {
    logger.error({ err });
  }
}
