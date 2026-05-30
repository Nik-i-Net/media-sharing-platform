import type { StorageProvider } from '@/features/uploads/application/ports/storage.provider';
import * as schema from '@/shared/db/drizzle/schema';
import { and, eq, inArray, notExists, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Logger } from 'pino';

const { blobsTable, uploadsTable } = schema;

// NOTE: potential race condition between selecting unused blobs and deletion
export async function deleteUnusedBlobsJob(
  db: NodePgDatabase<typeof schema>,
  storageProvider: StorageProvider,
  logger: Logger,
) {
  try {
    let limit = 2; // NOTE: test value
    let offset = 0;

    while (true) {
      const unusedBlobs = await db
        .select({ id: blobsTable.id, hash: blobsTable.hash })
        .from(blobsTable)
        .where(
          and(
            sql`${blobsTable.createdAt} < NOW() - INTERVAL '30 days'`,
            notExists(
              db
                .select({ id: uploadsTable.id })
                .from(uploadsTable)
                .where(eq(uploadsTable.blobId, blobsTable.id)),
            ),
          ),
        )
        .limit(limit)
        .offset(offset);

      offset += limit;

      logger.info({ found: unusedBlobs.length }, 'Found unused blobs');
      if (unusedBlobs.length === 0) break;

      const result = await storageProvider.batchDelete(unusedBlobs);
      if (result.errors) {
        logger.error({
          ctx: 'storageProvider.batchDelete',
          errors: result.errors,
        });
      }

      const { rowCount } = await db
        .delete(blobsTable)
        .where(inArray(blobsTable.id, result.deletedIds));

      logger.info({ deleted: rowCount ?? 0 }, 'Deleted unused blobs');
    }
  } catch (err) {
    logger.error({ err });
  }
}
