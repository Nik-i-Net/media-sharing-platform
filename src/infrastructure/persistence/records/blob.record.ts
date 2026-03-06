import { BlobEntity } from '../../../domain/blob';

export interface BlobRecord {
  id: number;
  storageKey: string;
  hash: string;
  hashAlgorithm: string;
  mimeType: string;
  size: number;
  createdAt: Date;
}

export type InsertBlobRecord = Omit<BlobRecord, 'id'>;
export type UpdateBlobRecord = Partial<Pick<BlobRecord, 'storageKey' | 'hash' | 'hashAlgorithm'>>;

export class BlobMapper {
  public static toNewRecord(blob: BlobEntity): InsertBlobRecord {
    return {
      storageKey: blob.storageKey,
      hash: blob.hash,
      hashAlgorithm: blob.hashAlgorithm,
      mimeType: blob.mimeType,
      size: blob.size,
      createdAt: blob.createdAt,
    };
  }

  public static toUpdateRecord(blob: BlobEntity): UpdateBlobRecord {
    return {
      storageKey: blob.storageKey,
      hash: blob.hash,
      hashAlgorithm: blob.hashAlgorithm,
    };
  }

  public static toDomain(record: BlobRecord): BlobEntity {
    return new BlobEntity(
      record.id,
      record.storageKey,
      record.hash,
      record.hashAlgorithm,
      record.mimeType,
      record.size,
      record.createdAt,
    );
  }
}
