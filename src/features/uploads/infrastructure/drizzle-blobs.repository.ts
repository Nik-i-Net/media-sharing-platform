import { blobsTable } from '@/shared/db/drizzle/schema';
import type { DrizzleDB, DrizzleTransaction } from '@/shared/db/drizzle/types';
import { excluded } from '@/shared/db/drizzle/utils';
import { eq, inArray, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { BlobEntity } from '../domain/blob';
import type { BlobsRepository } from '../domain/blobs.repository';
import { HashVO } from '../domain/hash.value-object';

export class DrizzleBlobsRepository implements BlobsRepository {
  constructor(private readonly db: DrizzleDB | DrizzleTransaction) {}

  async save(blob: BlobEntity): Promise<void> {
    await this.db
      .insert(blobsTable)
      .values(this.toInsertModel(blob))
      .onConflictDoUpdate({
        target: blobsTable.id,
        set: {
          mimeType: blob.mimeType,
          status: blob.status,
          updatedAt: blob.updatedAt,
        },
      });
  }

  async saveMany(blobs: BlobEntity[]): Promise<void> {
    await this.db
      .insert(blobsTable) //
      .values(blobs.map((blob) => this.toInsertModel(blob)))
      .onConflictDoUpdate({
        target: blobsTable.id,
        set: {
          mimeType: excluded(blobsTable.mimeType),
          status: excluded(blobsTable.status),
          updatedAt: excluded(blobsTable.updatedAt),
        },
      });
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
      where: eq(blobsTable.hash, hash),
    });
    if (!record) return null;
    return this.toDomain(record);
  }

  async findManyByHashes(hashes: HashVO[]): Promise<BlobEntity[]> {
    const records = await this.db.query.blobsTable.findMany({
      where: inArray(
        blobsTable.hash,
        hashes.map((hash) => hash),
      ),
    });
    return records.map((record) => this.toDomain(record));
  }

  async findSizeById(id: string): Promise<number | null> {
    const [row] = await this.db
      .select({ sizeBytes: blobsTable.sizeBytes })
      .from(blobsTable)
      .where(eq(blobsTable.id, id));

    if (!row) return null;
    return row.sizeBytes;
  }

  private toDomain(record: InferSelectModel<typeof blobsTable>): BlobEntity {
    return new BlobEntity(
      record.id,
      record.hash,
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
      hash: blob.hash,
      mimeType: blob.mimeType,
      sizeBytes: blob.sizeBytes,
      status: blob.status,
      createdAt: blob.createdAt,
      updatedAt: blob.updatedAt,
    };
  }
}
