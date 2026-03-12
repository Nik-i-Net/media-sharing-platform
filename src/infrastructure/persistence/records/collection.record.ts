import { Collection } from '../../../domain/entities/collection';

export interface CollectionRecord {
  id: string;
  user_id: string;
  title: string;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}

export type InsertCollectionRecord = CollectionRecord;
export type UpdateCollectionRecord = Partial<Pick<CollectionRecord, 'title' | 'is_public' | 'updated_at'>>;

export class CollectionMapper {
  public static toPersistence(collection: Collection): CollectionRecord {
    return {
      id: collection.id,
      user_id: collection.userId,
      title: collection.title,
      is_public: collection.isPublic,
      created_at: collection.createdAt,
      updated_at: collection.updatedAt,
    };
  }

  public static toDomain(record: CollectionRecord): Collection {
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
