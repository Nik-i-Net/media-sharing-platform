import { BlobEntity } from '../../../domain/entities/blob';

export interface BlobRecord {
  id: number;
  storage_key: string;
  hash: string;
  hash_algorithm: string;
  mime_type: string;
  size_bytes: number;
  created_at: Date;
  updated_at: Date;
}

export type InsertBlobRecord = Omit<BlobRecord, 'id'>;
export type UpdateBlobRecord = Partial<Pick<BlobRecord, 'storage_key' | 'hash' | 'hash_algorithm'>>;

export class BlobMapper {
  public static toNewRecord(blob: BlobEntity): InsertBlobRecord {
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

  public static toUpdateRecord(blob: BlobEntity): UpdateBlobRecord {
    return {
      storage_key: blob.storageKey,
      hash: blob.hash,
      hash_algorithm: blob.hashAlgorithm,
    };
  }

  public static toDomain(record: BlobRecord): BlobEntity {
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
