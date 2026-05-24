import type { DrizzleDB, DrizzleTransaction } from '@/shared/db/drizzle/client';
import type { AlbumsRepository } from '../domain/albums.repository';
import { and, asc, eq, inArray, type InferSelectModel } from 'drizzle-orm';
import { albumsUploadsTable, albumsTable } from '@/shared/db/drizzle/schema';
import { Album } from '../domain/album';

export class DrizzleAlbumsRepository implements AlbumsRepository {
  constructor(private readonly db: DrizzleDB | DrizzleTransaction) {}

  async save(album: Album): Promise<void> {
    await this.db
      .insert(albumsTable)
      .values({
        id: album.id,
        userId: album.userId,
        name: album.name,
        isPublic: album.isPublic,
        createdAt: album.createdAt,
        updatedAt: album.updatedAt,
      })
      .onConflictDoUpdate({
        target: albumsTable.id,
        set: {
          name: album.name,
          isPublic: album.isPublic,
          updatedAt: album.updatedAt,
        },
      });
  }

  async findById(id: string): Promise<Album | null> {
    const record = await this.db.query.albumsTable.findFirst({
      where: eq(albumsTable.id, id),
    });
    if (!record) return null;
    return this.toDomain(record);
  }

  async findAllByUserId(userId: string, limit?: number, offset?: number): Promise<Album[]> {
    const records = await this.db.query.albumsTable.findMany({
      where: eq(albumsTable.userId, userId),
      orderBy: [asc(albumsTable.createdAt)],
      limit,
      offset,
    });
    return records.map((record) => this.toDomain(record));
  }

  async existsById(id: string): Promise<boolean> {
    const record = await this.db.query.albumsTable.findFirst({
      columns: { id: true },
      where: eq(albumsTable.id, id),
    });
    return Boolean(record);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.delete(albumsTable).where(eq(albumsTable.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async isOwner(userId: string, albumId: string): Promise<boolean> {
    const record = await this.db.query.albumsTable.findFirst({
      columns: { userId: true },
      where: eq(albumsTable.id, albumId),
    });
    return !!record && record.userId === userId;
  }

  async linkUploads(albumId: string, uploadIds: string[]) {
    await this.db
      .insert(albumsUploadsTable)
      .values(uploadIds.map((id) => ({ albumId, uploadId: id })))
      .onConflictDoNothing();
  }

  async unlinkUploads(albumId: string, uploadIds: string[]) {
    await this.db
      .delete(albumsUploadsTable)
      .where(
        and(
          eq(albumsUploadsTable.albumId, albumId),
          inArray(albumsUploadsTable.uploadId, uploadIds),
        ),
      );
  }

  private toDomain(record: InferSelectModel<typeof albumsTable>) {
    return new Album(
      record.id,
      record.userId,
      record.name,
      record.isPublic,
      record.createdAt,
      record.updatedAt,
    );
  }
}
