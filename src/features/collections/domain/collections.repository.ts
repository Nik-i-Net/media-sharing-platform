import type { Collection } from './collection';

export interface CollectionsRepository {
  save(collection: Collection): Promise<void>;
  findById(id: string): Promise<Collection | null>;
  findAllByUserId(userId: string, limit?: number, offset?: number): Promise<Collection[]>;
  existsById(id: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;

  addMedia(collectionId: string, mediaIds: string[]): Promise<void>;
  removeMedia(collectionId: string, mediaIds: string[]): Promise<void>;
}
