import type { DrizzleDB, DrizzleTransaction } from '@/shared/persistence/drizzle/client';
import type { CollectionsRepository } from '../domain/collections.repository';
import { asc, eq, type InferSelectModel } from 'drizzle-orm';
import { collectionsTable } from '@/shared/persistence/drizzle/schema';
import { Collection } from '../domain/collection';

export class DrizzleCollectionsRepository implements CollectionsRepository {
  constructor(private readonly db: DrizzleDB | DrizzleTransaction) {}

  async save(collection: Collection): Promise<void> {
    await this.db
      .insert(collectionsTable)
      .values({
        id: collection.id,
        userId: collection.userId,
        name: collection.name,
        isPublic: collection.isPublic,
        createdAt: collection.createdAt,
        updatedAt: collection.updatedAt,
      })
      .onConflictDoUpdate({
        target: collectionsTable.id,
        set: {
          name: collection.name,
          isPublic: collection.isPublic,
          updatedAt: collection.updatedAt,
        },
      });
  }

  async findById(id: string): Promise<Collection | null> {
    const record = await this.db.query.collectionsTable.findFirst({
      where: eq(collectionsTable.id, id),
    });
    if (!record) return null;
    return this.toDomain(record);
  }

  async findAllByUserId(userId: string, limit?: number, offset?: number): Promise<Collection[]> {
    const records = await this.db.query.collectionsTable.findMany({
      where: eq(collectionsTable.userId, userId),
      orderBy: [asc(collectionsTable.createdAt)],
      limit,
      offset,
    });
    return records.map((record) => this.toDomain(record));
  }

  async existsById(id: string): Promise<boolean> {
    const record = await this.db.query.collectionsTable.findFirst({
      columns: { id: true },
      where: eq(collectionsTable.id, id),
    });
    return Boolean(record);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.delete(collectionsTable).where(eq(collectionsTable.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  private toDomain(record: InferSelectModel<typeof collectionsTable>) {
    return new Collection(
      record.id,
      record.userId,
      record.name,
      record.isPublic,
      record.createdAt,
      record.updatedAt,
    );
  }
}
