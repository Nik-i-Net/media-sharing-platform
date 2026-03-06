import type { BlobEntity } from '../entities/blob';

export interface BlobRepository {
  save(blob: BlobEntity): Promise<void>;
  findByHash(hash: string): Promise<BlobEntity | null>;
}
