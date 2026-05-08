import type { Collection } from './collection';

export interface CollectionsRepository {
  save(collection: Collection): Promise<void>;
  findById(id: string): Promise<Collection | null>;
  findAllByUserId(userId: string, limit?: number, offset?: number): Promise<Collection[]>;
  delete(id: string): Promise<boolean>;
}
