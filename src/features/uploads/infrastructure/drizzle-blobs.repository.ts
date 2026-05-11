import type { DrizzleDB, DrizzleTransaction } from '@/shared/persistence/drizzle/client';
import { blobsTable } from '@/shared/persistence/drizzle/schema';
import { and, eq, inArray, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import type { BlobsRepository } from '../domain/blobs.repository';
import { BlobEntity } from '../domain/blob';

export class DrizzleBlobsRepository implements BlobsRepository {
  private readonly defaultHashAlgorithm = 'sha256base64';

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

  async findByHash(hash: string): Promise<BlobEntity | null> {
    const record = await this.db.query.blobsTable.findFirst({
      where: and(
        eq(blobsTable.hash, hash), //
        eq(blobsTable.hashAlgorithm, this.defaultHashAlgorithm),
      ),
    });
    if (!record) return null;
    return this.toDomain(record);
  }

  async findManyByHashes(hashes: string[]): Promise<BlobEntity[]> {
    const records = await this.db.query.blobsTable.findMany({
      where: and(
        inArray(blobsTable.hash, hashes), //
        eq(blobsTable.hashAlgorithm, this.defaultHashAlgorithm),
      ),
    });
    return records.map((record) => this.toDomain(record));
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.delete(blobsTable).where(eq(blobsTable.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  private toDomain(record: InferSelectModel<typeof blobsTable>): BlobEntity {
    return new BlobEntity(
      record.id,
      record.storageKey,
      record.hash,
      record.hashAlgorithm,
      record.mimeType,
      record.sizeBytes,
      record.createdAt,
      record.updatedAt,
    );
  }

  private toInsertModel(blob: BlobEntity): InferInsertModel<typeof blobsTable> {
    return {
      id: blob.id,
      storageKey: blob.storageKey,
      hash: blob.hash,
      hashAlgorithm: blob.hashAlgorithm,
      mimeType: blob.mimeType,
      sizeBytes: blob.sizeBytes,
      createdAt: blob.createdAt,
      updatedAt: blob.updatedAt,
    };
  }
}
