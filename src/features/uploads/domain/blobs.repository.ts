import { BlobEntity } from '../domain/blob';

export interface BlobsRepository {
  save(blob: BlobEntity): Promise<void>;
  saveMany(blobs: BlobEntity[]): Promise<void>;
  findById(id: string): Promise<BlobEntity | null>;
  findByHash(hash: string): Promise<BlobEntity | null>;
  findManyByHashes(hashes: string[]): Promise<BlobEntity[]>;
  delete(id: string): Promise<boolean>;
}
