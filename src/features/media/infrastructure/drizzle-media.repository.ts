import { mediaTable } from '@/shared/persistence/drizzle/schema';
import { eq } from 'drizzle-orm';
import { Media } from '../domain/media';
import type { DrizzleDB, DrizzleTransaction } from '@/shared/persistence/drizzle/client';
import type { MediaRepository } from '../domain/media.repository';

export class DrizzleMediaRepository implements MediaRepository {
  constructor(private readonly db: DrizzleDB | DrizzleTransaction) {}

  async save(media: Media): Promise<void> {
    await this.db
      .insert(mediaTable)
      .values({
        id: media.id,
        userId: media.userId,
        blobId: media.blobId,
        fileName: media.fileName,
        expiresAt: media.expiresAt,
        createdAt: media.createdAt,
        updatedAt: media.updatedAt,
      })
      .onConflictDoUpdate({
        target: mediaTable.id,
        set: {
          fileName: media.fileName,
          expiresAt: media.expiresAt,
          updatedAt: media.updatedAt,
        },
      });
  }

  async findById(id: string): Promise<Media | null> {
    const row = await this.db.query.mediaTable.findFirst({
      where: eq(mediaTable.id, id),
    });
    if (!row) return null;
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

  async delete(id: string): Promise<boolean> {
    const result = await this.db.delete(mediaTable).where(eq(mediaTable.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}
