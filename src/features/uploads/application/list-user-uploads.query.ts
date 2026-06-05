import type { UserCountersRepository } from '@/features/users/domain/user-counters.repository';
import { blobsTable, uploadsTable } from '@/shared/db/drizzle/schema';
import type { DrizzleDB } from '@/shared/db/drizzle/types';
import assert from 'assert';
import { and, desc, eq } from 'drizzle-orm';
import type { StorageProvider } from './ports/storage.provider';

export interface ListUserUploadsQuery {
  userId: string;
  page: number;
  limit: number;
}

export class ListUserUploadsQueryHandler {
  constructor(
    private readonly db: DrizzleDB,
    private readonly userCountersRepo: UserCountersRepository,
    private readonly storageProvider: StorageProvider,
  ) {}

  async execute({ userId, page, limit }: ListUserUploadsQuery): Promise<PaginatedResult> {
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

    const [uploads, counters] = await Promise.all([
      uploadsPromise,
      this.userCountersRepo.findCounters(userId),
    ]);
    assert(counters !== null);

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
      totalItems: counters.totalUploads,
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

  totalItems: number;
}
