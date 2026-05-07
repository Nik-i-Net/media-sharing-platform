import { Collection } from './domain/collection';
import type { Knex } from 'knex';

export class CollectionRepository {
  constructor(private readonly db: Knex) {}

  async save(collection: Collection): Promise<void> {
    const data = this.toPersistence(collection);
    await this.db('collections') //
      .insert(data)
      .onConflict('id')
      .merge(['title', 'updated_at']);
  }

  async findById(id: string): Promise<Collection | null> {
    const record = await this.db('collections').where({ id }).first();
    if (!record) return null;
    return this.toDomain(record);
  }

  async findAllByUserId(userId: string, limit?: number, offset?: number): Promise<Collection[]> {
    const query = this.db('collections').where({ user_id: userId });
    if (limit) query.limit(limit);
    if (offset) query.offset(offset);
    const records = await query;
    return records.map((record) => this.toDomain(record));
  }

  async delete(id: string): Promise<boolean> {
    const affectedRows = await this.db('collections').where({ id }).del();
    return affectedRows > 0;
  }

  public toPersistence(collection: Collection): CollectionRecord {
    return {
      id: collection.id,
      user_id: collection.userId,
      title: collection.title,
      is_public: collection.isPublic,
      created_at: collection.createdAt,
      updated_at: collection.updatedAt,
    };
  }

  public toDomain(record: CollectionRecord): Collection {
    return new Collection(
      record.id, //
      record.user_id,
      record.title,
      record.is_public,
      record.created_at,
      record.updated_at,
    );
  }
}

interface CollectionRecord {
  id: string;
  user_id: string;
  title: string;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}
type InsertCollectionRecord = CollectionRecord;
type UpdateCollectionRecord = Partial<Pick<CollectionRecord, 'title' | 'is_public' | 'updated_at'>>;

declare module 'knex/types/tables' {
  interface Tables {
    collections: Knex.CompositeTableType<
      CollectionRecord,
      InsertCollectionRecord,
      UpdateCollectionRecord
    >;
  }
}
