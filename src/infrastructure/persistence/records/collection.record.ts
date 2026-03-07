import { Collection } from '../../../domain/entities/collection';

export interface CollectionRecord {
  id: string;
  user_id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export type InsertCollectionRecord = CollectionRecord;
export type UpdateCollectionRecord = Partial<Pick<CollectionRecord, 'name' | 'updated_at'>>;

export class CollectionMapper {
  public static toPersistence(collection: Collection): CollectionRecord {
    return {
      id: collection.id,
      user_id: collection.userId,
      name: collection.name,
      created_at: collection.createdAt,
      updated_at: collection.updatedAt,
    };
  }

  public static toDomain(record: CollectionRecord): Collection {
    return new Collection(
      record.id, //
      record.user_id,
      record.name,
      record.created_at,
      record.updated_at,
    );
  }
}
