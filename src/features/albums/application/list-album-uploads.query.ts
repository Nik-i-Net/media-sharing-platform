import type { StorageProvider } from '@/features/uploads/application/ports/storage.provider';
import type { DrizzleDB } from '@/shared/db/drizzle/client';
import {
  albumsTable,
  albumsUploadsTable,
  blobsTable,
  uploadsTable,
} from '@/shared/db/drizzle/schema';
import { and, desc, eq } from 'drizzle-orm';
import { AlbumNotFoundError } from '../errors/album-not-found.error';

export interface ListAlbumUploadsQuery {
  userId: string;
  albumId: string;
  page?: number;
  limit?: number;
}

export class ListAlbumUploadsQueryHandler {
  constructor(
    private readonly db: DrizzleDB,
    private readonly storageProvider: StorageProvider,
  ) {}

  async execute(query: ListAlbumUploadsQuery): Promise<PaginatedResult> {
    const { userId, albumId, page = 1, limit = 20 } = query;

    const album = await this.db.query.albumsTable.findFirst({
      columns: { userId: true },
      where: eq(albumsTable.id, albumId),
    });
    if (!album) throw new AlbumNotFoundError();

    const isOwner = album.userId === userId;

    const privateFields = {
      isPublic: uploadsTable.isPublic,
      expiresAt: uploadsTable.expiresAt,
      createdAt: uploadsTable.createdAt,
    };

    const uploadsPromise = this.db
      .select({
        id: uploadsTable.id,
        fileName: uploadsTable.fileName,
        mimeType: blobsTable.mimeType,
        sizeBytes: blobsTable.sizeBytes,
        hash: blobsTable.hash,
        ...(isOwner ? privateFields : {}),
      })
      .from(albumsUploadsTable)
      .innerJoin(uploadsTable, eq(albumsUploadsTable.uploadId, uploadsTable.id))
      .innerJoin(blobsTable, eq(uploadsTable.blobId, blobsTable.id))
      .where(
        and(
          eq(albumsUploadsTable.albumId, albumId), //
          eq(blobsTable.status, 'ready'),
          isOwner ? undefined : eq(uploadsTable.isPublic, true),
        ),
      )
      .orderBy(desc(uploadsTable.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    const [uploads, totalItems] = await Promise.all([
      uploadsPromise,
      this.db.$count(albumsUploadsTable, eq(albumsUploadsTable.albumId, albumId)),
    ]);

    const meta = {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit) || 1,
    };

    if (isOwner) {
      return {
        data: uploads.map((u) => ({
          id: u.id,
          fileName: u.fileName,
          mimeType: u.mimeType,
          sizeBytes: u.sizeBytes,
          previewUrl: this.storageProvider.getPreviewUrl(u.hash),
          isPublic: u.isPublic!,
          expiresAt: u.expiresAt!,
          createdAt: u.createdAt!,
        })),
        meta,
      };
    } else {
      return {
        data: uploads.map((u) => ({
          id: u.id,
          fileName: u.fileName,
          mimeType: u.mimeType,
          sizeBytes: u.sizeBytes,
          previewUrl: this.storageProvider.getPreviewUrl(u.hash),
        })),
        meta,
      };
    }
  }
}

interface PublicInfo {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  previewUrl: string;
}

interface PrivateInfo extends PublicInfo {
  isPublic: boolean;
  expiresAt: Date | null;
  createdAt: Date;
}

interface PaginatedResult {
  data: PublicInfo[] | PrivateInfo[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
