import type { Knex } from 'knex';
import type { BlobEntity } from '../../domain/entities/blob';
import { BlobMapper } from '../persistence/records/blob.record';
import type { BlobRepository } from '../../domain/repositories/blob.repository';

export class KnexBlobRepository implements BlobRepository {
  constructor(private readonly db: Knex) {}

  async save(blob: BlobEntity): Promise<void> {
    if (blob.id === null) {
      const data = BlobMapper.toNewRecord(blob);
      await this.blobs.insert(data);
    } else {
      const data = BlobMapper.toUpdateRecord(blob);
      await this.blobs.where({ id: blob.id }).update(data);
    }
  }

  async findById(id: number): Promise<BlobEntity | null> {
    const record = await this.blobs.where({ id }).first();
    if (!record) return null;
    return BlobMapper.toDomain(record);
  }

  async findByHash(hash: string, hashAlgorithm: string = 'sha256base64'): Promise<BlobEntity | null> {
    const record = await this.blobs.where({ hash, hash_algorithm: hashAlgorithm }).first();
    if (!record) return null;
    return BlobMapper.toDomain(record);
  }

  private get blobs() {
    return this.db('blobs');
  }
}
