import type { DrizzleDB, DrizzleTransaction } from '@/shared/db/drizzle/client';
import { uploadsTable } from '@/shared/db/drizzle/schema';
import { excluded } from '@/shared/db/drizzle/utils';
import { eq, inArray, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { Upload } from '../domain/upload';
import type { UploadsRepository } from '../domain/uploads.repository';

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
          isPublic: upload.isPublic,
          expiresAt: upload.expiresAt,
          updatedAt: upload.updatedAt,
        },
      });
  }

  async saveMany(uploads: Upload[]): Promise<void> {
    await this.db
      .insert(uploadsTable)
      .values(uploads.map((m) => this.toInsertModel(m)))
      .onConflictDoUpdate({
        target: uploadsTable.id,
        set: {
          fileName: excluded(uploadsTable.fileName),
          isPublic: excluded(uploadsTable.isPublic),
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

  async delete(id: string): Promise<{ isDeleted: true; blobId: string } | { isDeleted: false }> {
    const [result] = await this.db.delete(uploadsTable).where(eq(uploadsTable.id, id)).returning();
    if (!result) return { isDeleted: false };

    return { isDeleted: true, blobId: result.blobId };
  }

  async findOwnershipData(ids: string[]): Promise<{ uploadId: string; userId: string }[]> {
    return await this.db
      .select({
        uploadId: uploadsTable.id,
        userId: uploadsTable.userId,
      })
      .from(uploadsTable)
      .where(inArray(uploadsTable.id, ids));
  }

  private toDomain(row: InferSelectModel<typeof uploadsTable>): Upload {
    return new Upload(
      row.id,
      row.userId,
      row.blobId,
      row.fileName,
      row.isPublic,
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
      isPublic: upload.isPublic,
      expiresAt: upload.expiresAt,
      createdAt: upload.createdAt,
      updatedAt: upload.updatedAt,
    };
  }
}
