import { BlobEntity } from '../domain/blob';
import type { HashVO } from './hash.value-object';

export interface BlobsRepository {
  save(blob: BlobEntity): Promise<void>;
  saveMany(blobs: BlobEntity[]): Promise<void>;
  findById(id: string): Promise<BlobEntity | null>;
  findByHash(hash: HashVO): Promise<BlobEntity | null>;
  findManyByHashes(hashes: HashVO[]): Promise<BlobEntity[]>;
}
