import type { Knex } from 'knex';
import type { CollectionRepository } from '../../domain/repositories/collection.repository';
import type { Collection } from '../../domain/entities/collection';
import { CollectionMapper } from '../persistence/records/collection.record';

export class KnexCollectionRepository implements CollectionRepository {
  constructor(private readonly db: Knex) {}

  async save(collection: Collection): Promise<void> {
    const data = CollectionMapper.toPersistence(collection);
    await this.collections //
      .insert(data)
      .onConflict('id')
      .merge(['name', 'updated_at']);
  }

  async findById(id: string): Promise<Collection | null> {
    const record = await this.collections.where({ id }).first();
    if (!record) return null;
    return CollectionMapper.toDomain(record);
  }

  async findAllByUserId(userId: string): Promise<Collection[]> {
    const records = await this.collections.where({ user_id: userId });
    return records.map((record) => CollectionMapper.toDomain(record));
  }

  async delete(id: string): Promise<boolean> {
    const affectedRows = await this.collections.where({ id }).del();
    return affectedRows > 0;
  }

  private get collections() {
    return this.db('collections');
  }
}
