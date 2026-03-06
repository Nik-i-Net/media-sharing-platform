import type { Knex } from 'knex';
import type { BlobEntity } from '../../domain/blob';
import { BlobMapper } from '../persistence/records/blob.record';

export class KnexBlobRepository {
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

  async findByHash(hash: string, hashAlgorithm: string = 'sha256base64'): Promise<BlobEntity | null> {
    const record = await this.blobs.where({ hash, hashAlgorithm }).first();
    if (!record) return null;
    return BlobMapper.toDomain(record);
  }

  private get blobs() {
    return this.db('blobs');
  }
}
