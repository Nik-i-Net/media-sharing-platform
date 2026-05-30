import * as schema from '@/shared/db/drizzle/schema';
import { sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Logger } from 'pino';

const { uploadsTable } = schema;

export async function deleteExpiredUploadsJob(
  db: NodePgDatabase<typeof schema>, //
  logger: Logger,
) {
  try {
    const { rowCount } = await db
      .delete(uploadsTable)
      .where(sql`${uploadsTable.expiresAt} < NOW()`);

    logger.info({ deleted: rowCount ?? 0 }, 'Deleted expired uploads');
  } catch (err) {
    logger.error({ err });
  }
}
