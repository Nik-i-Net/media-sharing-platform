import type { DrizzleDB, DrizzleTransaction } from '@/shared/db/drizzle/client';
import { blobsTable } from '@/shared/db/drizzle/schema';
import { eq, inArray, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import type { BlobsRepository } from '../domain/blobs.repository';
import { BlobEntity } from '../domain/blob';
import { HashVO } from '../domain/hash.value-object';

export class DrizzleBlobsRepository implements BlobsRepository {
  constructor(private readonly db: DrizzleDB | DrizzleTransaction) {}

  async save(blob: BlobEntity): Promise<void> {
    await this.db.insert(blobsTable).values(this.toInsertModel(blob));
  }

  async saveMany(blobs: BlobEntity[]): Promise<void> {
    await this.db.insert(blobsTable).values(blobs.map((blob) => this.toInsertModel(blob)));
  }

  async findById(id: string): Promise<BlobEntity | null> {
    const record = await this.db.query.blobsTable.findFirst({
      where: eq(blobsTable.id, id),
    });
    if (!record) return null;
    return this.toDomain(record);
  }

  async findByHash(hash: HashVO): Promise<BlobEntity | null> {
    const record = await this.db.query.blobsTable.findFirst({
      where: eq(blobsTable.hash, hash.value),
    });
    if (!record) return null;
    return this.toDomain(record);
  }

  async findManyByHashes(hashes: HashVO[]): Promise<BlobEntity[]> {
    const records = await this.db.query.blobsTable.findMany({
      where: inArray(
        blobsTable.hash,
        hashes.map((hash) => hash.value),
      ),
    });
    return records.map((record) => this.toDomain(record));
  }

  private toDomain(record: InferSelectModel<typeof blobsTable>): BlobEntity {
    return new BlobEntity(
      record.id,
      new HashVO(record.hash),
      record.mimeType,
      record.sizeBytes,
      record.status,
      record.createdAt,
      record.updatedAt,
    );
  }

  private toInsertModel(blob: BlobEntity): InferInsertModel<typeof blobsTable> {
    return {
      id: blob.id,
      hash: blob.hash.value,
      mimeType: blob.mimeType,
      sizeBytes: blob.sizeBytes,
      status: blob.status,
      createdAt: blob.createdAt,
      updatedAt: blob.updatedAt,
    };
  }
}
