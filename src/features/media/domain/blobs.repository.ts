import { BlobEntity } from '../domain/blob';

export interface BlobRepository {
  save(blob: BlobEntity): Promise<void>;
  findById(id: number): Promise<BlobEntity | null>;
  findByHash(hash: string): Promise<BlobEntity | null>;
  findByHashes(hashes: string[]): Promise<(BlobEntity | null)[]>;
}
