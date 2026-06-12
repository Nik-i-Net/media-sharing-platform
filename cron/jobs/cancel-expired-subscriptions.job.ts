import * as schema from '@/shared/db/drizzle/schema';
import { and, sql, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Logger } from 'pino';

const { subscriptionsTable } = schema;

export async function cancelExpiredSubscriptionsJob(
  db: NodePgDatabase<typeof schema>, //
  logger: Logger,
) {
  try {
    const { rowCount } = await db
      .update(subscriptionsTable)
      .set({ status: 'canceled' })
      .where(
        and(
          inArray(subscriptionsTable.status, ['active']), // NOTE: add past_due when implemented
          sql`${subscriptionsTable.expiresAt} < NOW() - INTERVAL '7 days'`,
        ),
      );

    logger.info({ canceled: rowCount ?? 0 }, 'Canceled expired subscriptions');
  } catch (err) {
    logger.error({ err });
  }
}
