import { blobsTable, uploadsTable } from '@/shared/db/drizzle/schema';
import { and, desc, eq } from 'drizzle-orm';
import type { DrizzleDB } from '@/shared/db/drizzle/client';
import type { StorageProvider } from './ports/storage.provider';

export interface ListUserUploadsQuery {
  userId: string;
  page?: number;
  limit?: number;
}

export class ListUserUploadsQueryHandler {
  constructor(
    private readonly db: DrizzleDB,
    private readonly storageProvider: StorageProvider,
  ) {}

  async execute({ userId, page = 1, limit = 20 }: ListUserUploadsQuery): Promise<PaginatedResult> {
    const uploadsPromise = this.db
      .select({
        id: uploadsTable.id,
        fileName: uploadsTable.fileName,
        mimeType: blobsTable.mimeType,
        sizeBytes: blobsTable.sizeBytes,
        hash: blobsTable.hash,
        isPublic: uploadsTable.isPublic,
        expiresAt: uploadsTable.expiresAt,
        createdAt: uploadsTable.createdAt,
      })
      .from(uploadsTable)
      .innerJoin(blobsTable, eq(uploadsTable.blobId, blobsTable.id))
      .where(
        and(
          eq(uploadsTable.userId, userId), //
          eq(blobsTable.status, 'ready'),
        ),
      )
      .orderBy(desc(uploadsTable.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    const [uploads, totalItems] = await Promise.all([
      uploadsPromise,
      this.db.$count(uploadsTable, eq(uploadsTable.userId, userId)),
    ]);

    return {
      data: uploads.map((upload) => ({
        id: upload.id,
        fileName: upload.fileName,
        mimeType: upload.mimeType,
        sizeBytes: upload.sizeBytes,
        previewUrl: this.storageProvider.getPreviewUrl(upload.hash),
        isPublic: upload.isPublic,
        expiresAt: upload.expiresAt,
        createdAt: upload.createdAt,
      })),
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit) || 1,
      },
    };
  }
}

interface PaginatedResult {
  data: {
    id: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    previewUrl: string;
    isPublic: boolean;
    expiresAt: Date | null;
    createdAt: Date;
  }[];

  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
