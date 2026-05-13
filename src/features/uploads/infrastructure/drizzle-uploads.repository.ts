import { uploadsTable } from '@/shared/db/drizzle/schema';
import { eq, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { Upload } from '../domain/upload';
import type { DrizzleDB, DrizzleTransaction } from '@/shared/db/drizzle/client';
import type { UploadsRepository } from '../domain/uploads.repository';
import { excluded } from '@/shared/db/drizzle/utils';

export class DrizzleUploadsRepository implements UploadsRepository {
  constructor(private readonly db: DrizzleDB | DrizzleTransaction) {}

  async save(upload: Upload): Promise<void> {
    await this.db
      .insert(uploadsTable)
      .values(this.toInsertModel(upload))
      .onConflictDoUpdate({
        target: uploadsTable.id,
        set: {
          fileName: upload.fileName,
          expiresAt: upload.expiresAt,
          updatedAt: upload.updatedAt,
        },
      });
  }

  async saveMany(upload: Upload[]): Promise<void> {
    await this.db
      .insert(uploadsTable)
      .values(upload.map((m) => this.toInsertModel(m)))
      .onConflictDoUpdate({
        target: uploadsTable.id,
        set: {
          fileName: excluded(uploadsTable.fileName),
          expiresAt: excluded(uploadsTable.expiresAt),
          updatedAt: excluded(uploadsTable.updatedAt),
        },
      });
  }

  async findById(id: string): Promise<Upload | null> {
    const row = await this.db.query.uploadsTable.findFirst({
      where: eq(uploadsTable.id, id),
    });
    if (!row) return null;
    return this.toDomain(row);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.delete(uploadsTable).where(eq(uploadsTable.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  private toDomain(row: InferSelectModel<typeof uploadsTable>): Upload {
    return new Upload(
      row.id,
      row.userId,
      row.blobId,
      row.fileName,
      row.expiresAt,
      row.createdAt,
      row.updatedAt,
    );
  }

  private toInsertModel(upload: Upload): InferInsertModel<typeof uploadsTable> {
    return {
      id: upload.id,
      userId: upload.userId,
      blobId: upload.blobId,
      fileName: upload.fileName,
      expiresAt: upload.expiresAt,
      createdAt: upload.createdAt,
      updatedAt: upload.updatedAt,
    };
  }
}
