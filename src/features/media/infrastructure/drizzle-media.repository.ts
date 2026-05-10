import { mediaTable } from '@/shared/persistence/drizzle/schema';
import { eq, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { Media } from '../domain/media';
import type { DrizzleDB, DrizzleTransaction } from '@/shared/persistence/drizzle/client';
import type { MediaRepository } from '../domain/media.repository';
import { excluded } from '@/shared/persistence/drizzle/utils';

export class DrizzleMediaRepository implements MediaRepository {
  constructor(private readonly db: DrizzleDB | DrizzleTransaction) {}

  async save(media: Media): Promise<void> {
    await this.db
      .insert(mediaTable)
      .values(this.toInsertModel(media))
      .onConflictDoUpdate({
        target: mediaTable.id,
        set: {
          fileName: media.fileName,
          expiresAt: media.expiresAt,
          updatedAt: media.updatedAt,
        },
      });
  }

  async saveMany(media: Media[]): Promise<void> {
    await this.db
      .insert(mediaTable)
      .values(media.map((m) => this.toInsertModel(m)))
      .onConflictDoUpdate({
        target: mediaTable.id,
        set: {
          fileName: excluded(mediaTable.fileName),
          expiresAt: excluded(mediaTable.expiresAt),
          updatedAt: excluded(mediaTable.updatedAt),
        },
      });
  }

  async findById(id: string): Promise<Media | null> {
    const row = await this.db.query.mediaTable.findFirst({
      where: eq(mediaTable.id, id),
    });
    if (!row) return null;
    return this.toDomain(row);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.delete(mediaTable).where(eq(mediaTable.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  private toDomain(row: InferSelectModel<typeof mediaTable>): Media {
    return new Media(
      row.id,
      row.userId,
      row.blobId,
      row.fileName,
      row.expiresAt,
      row.createdAt,
      row.updatedAt,
    );
  }

  private toInsertModel(media: Media): InferInsertModel<typeof mediaTable> {
    return {
      id: media.id,
      userId: media.userId,
      blobId: media.blobId,
      fileName: media.fileName,
      expiresAt: media.expiresAt,
      createdAt: media.createdAt,
      updatedAt: media.updatedAt,
    };
  }
}
