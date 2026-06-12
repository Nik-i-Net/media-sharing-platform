import { userCountersTable } from '@/shared/db/drizzle/schema';
import type { DrizzleDB, DrizzleTransaction } from '@/shared/db/drizzle/types';
import assert from 'assert';
import { eq, sql } from 'drizzle-orm';
import type { UserCounters, UserCountersRepository } from '../domain/user-counters.repository';

export class DrizzleUserCountersRepository implements UserCountersRepository {
  constructor(private readonly db: DrizzleDB | DrizzleTransaction) {}

  async initializeCounters(userId: string): Promise<void> {
    await this.db.insert(userCountersTable).values({
      userId,
      totalStorageBytes: 0,
      totalUploads: 0,
      totalAlbums: 0,
    });
  }

  async findCounters(userId: string): Promise<UserCounters | null> {
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

  async incrementTotalStorageBytes(userId: string, amountBytes: number): Promise<void> {
    assert(amountBytes > 0);
    await this.updateColumn(userId, 'totalStorageBytes', amountBytes);
  }
  async decrementTotalStorageBytes(userId: string, amountBytes: number): Promise<void> {
    assert(amountBytes > 0);
    await this.updateColumn(userId, 'totalStorageBytes', -1 * amountBytes);
  }

  async incrementTotalUploads(userId: string, amount: number): Promise<void> {
    assert(amount > 0);
    await this.updateColumn(userId, 'totalUploads', amount);
  }
  async decrementTotalUploads(userId: string, amount: number): Promise<void> {
    assert(amount > 0);
    await this.updateColumn(userId, 'totalUploads', -1 * amount);
  }

  async incrementTotalAlbums(userId: string, amount: number): Promise<void> {
    assert(amount > 0);
    await this.updateColumn(userId, 'totalAlbums', amount);
  }
  async decrementTotalAlbums(userId: string, amount: number): Promise<void> {
    assert(amount > 0);
    await this.updateColumn(userId, 'totalAlbums', -1 * amount);
  }

  private async updateColumn(
    userId: string,
    columnName: 'totalStorageBytes' | 'totalUploads' | 'totalAlbums',
    amount: number,
  ) {
    await this.db
      .update(userCountersTable)
      .set({
        [columnName]: sql`${userCountersTable[columnName]} + ${amount}`,
      })
      .where(eq(userCountersTable.userId, userId));
  }
}
