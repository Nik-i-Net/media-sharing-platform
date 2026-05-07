import { BlobEntity } from '../domain/blob';
import type { Knex } from 'knex';
import type { BlobRepository } from '../domain/blobs.repository';

export class KnexBlobRepository implements BlobRepository {
  constructor(private readonly db: Knex) {}

  async save(blob: BlobEntity): Promise<void> {
    if (blob.id === null) {
      const data = this.toNewRecord(blob);
      await this.db('blobs').insert(data);
    } else {
      const data = this.toUpdateRecord(blob);
      await this.db('blobs').where({ id: blob.id }).update(data);
    }
  }

  async findById(id: number): Promise<BlobEntity | null> {
    const record = await this.db('blobs').where({ id }).first();
    if (!record) return null;
    return this.toDomain(record);
  }

  async findByHash(
    hash: string,
    hashAlgorithm: string = 'sha256base64',
  ): Promise<BlobEntity | null> {
    const record = await this.db('blobs').where({ hash, hash_algorithm: hashAlgorithm }).first();
    if (!record) return null;
    return this.toDomain(record);
  }

  public toNewRecord(blob: BlobEntity): InsertBlobRecord {
    return {
      storage_key: blob.storageKey,
      hash: blob.hash,
      hash_algorithm: blob.hashAlgorithm,
      mime_type: blob.mimeType,
      size_bytes: blob.size,
      created_at: blob.createdAt,
      updated_at: blob.updatedAt,
    };
  }

  public toUpdateRecord(blob: BlobEntity): UpdateBlobRecord {
    return {
      storage_key: blob.storageKey,
      hash: blob.hash,
      hash_algorithm: blob.hashAlgorithm,
    };
  }

  public toDomain(record: BlobRecord): BlobEntity {
    return new BlobEntity(
      record.id,
      record.storage_key,
      record.hash,
      record.hash_algorithm,
      record.mime_type,
      record.size_bytes,
      record.created_at,
      record.updated_at,
    );
  }
}

interface BlobRecord {
  id: number;
  storage_key: string;
  hash: string;
  hash_algorithm: string;
  mime_type: string;
  size_bytes: number;
  created_at: Date;
  updated_at: Date;
}
type InsertBlobRecord = Omit<BlobRecord, 'id'>;
type UpdateBlobRecord = Partial<
  Pick<BlobRecord, 'storage_key' | 'hash' | 'hash_algorithm' | 'updated_at'>
>;

declare module 'knex/types/tables' {
  interface Tables {
    blobs: Knex.CompositeTableType<BlobRecord, InsertBlobRecord, UpdateBlobRecord>;
  }
}
