import type { DrizzleDB, DrizzleTransaction } from '@/shared/db/drizzle/client';
import { userCountersTable } from '@/shared/db/drizzle/schema';
import assert from 'assert';
import { eq } from 'drizzle-orm';
import type { UserCounters, UserCountersRepository } from '../domain/user-counters.repository';

export class DrizzleUserCountersRepository implements UserCountersRepository {
  constructor(private readonly db: DrizzleDB | DrizzleTransaction) {}

  async initializeUserCounters(userId: string): Promise<void> {
    await this.db.insert(userCountersTable).values({
      userId,
      totalStorageBytes: 0,
      totalUploads: 0,
      totalAlbums: 0,
    });
  }

  async getUserCounters(userId: string): Promise<UserCounters | null> {
    const row = await this.db.query.userCountersTable.findFirst({
      where: eq(userCountersTable.userId, userId),
    });
    if (!row) return null;

    return {
      totalStorageBytes: row.totalStorageBytes,
      totalUploads: row.totalUploads,
      totalAlbums: row.totalAlbums,
    };
  }

  async setTotalStorageBytes(userId: string, totalBytes: number): Promise<void> {
    const result = await this.db
      .update(userCountersTable)
      .set({ totalStorageBytes: totalBytes })
      .where(eq(userCountersTable.userId, userId));

    assert(
      result.rowCount === 1,
      `[DrizzleUserCountersRepository.setTotalStorageBytes] Unexpected row count: ${result.rowCount}`,
    );
  }

  async setTotalUploads(userId: string, totalUploads: number): Promise<void> {
    const result = await this.db
      .update(userCountersTable)
      .set({ totalUploads: totalUploads })
      .where(eq(userCountersTable.userId, userId));

    assert(
      result.rowCount === 1,
      `[DrizzleUserCountersRepository.setTotalUploads] Unexpected row count: ${result.rowCount}`,
    );
  }

  async setTotalAlbums(userId: string, totalAlbums: number): Promise<void> {
    const result = await this.db
      .update(userCountersTable)
      .set({ totalAlbums: totalAlbums })
      .where(eq(userCountersTable.userId, userId));

    assert(
      result.rowCount === 1,
      `[DrizzleUserCountersRepository.setTotalAlbums] Unexpected row count: ${result.rowCount}`,
    );
  }
}
