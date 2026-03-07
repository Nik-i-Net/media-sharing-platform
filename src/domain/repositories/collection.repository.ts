import type { Collection } from '../entities/collection';

export interface CollectionRepository {
  save(collection: Collection): Promise<void>;
  findById(id: string): Promise<Collection | null>;
  findAllByUserId(userId: string): Promise<Collection[]>;
  delete(id: string): Promise<boolean>;
}
