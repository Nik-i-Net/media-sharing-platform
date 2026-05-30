import { uploadsTable } from '@/shared/db/drizzle/schema';
import type { DrizzleDB } from '@/shared/db/drizzle/types';
import { eq } from 'drizzle-orm';
import { UploadNotFoundError } from '../errors/upload-not-found.error';
import type { StorageProvider } from './ports/storage.provider';

export interface GetUploadByIdQuery {
  uploadId: string;
  userId: string | null;
}

export class GetUploadByIdQueryHandler {
  constructor(
    private readonly db: DrizzleDB,
    private readonly storageProvider: StorageProvider,
  ) {}

  async execute({ uploadId, userId }: GetUploadByIdQuery): Promise<PublicInfo | PrivateInfo> {
    const upload = await this.db.query.uploadsTable.findFirst({
      where: eq(uploadsTable.id, uploadId),
      with: { blob: true },
    });

    if (!upload) throw new UploadNotFoundError();
    if (upload.blob?.status !== 'ready') throw new UploadNotFoundError();
    if (!upload.isPublic && userId !== upload.userId) throw new UploadNotFoundError();

    const basicInfo: BasicInfo = {
      id: upload.id,
      fileName: upload.fileName,
      mimeType: upload.blob.mimeType,
      sizeBytes: upload.blob.sizeBytes,
      url: this.storageProvider.getDownloadUrl(upload.blob.hash),
    };

    return userId !== upload.userId
      ? { ...basicInfo, canEdit: false }
      : {
          ...basicInfo,
          canEdit: true,
          isPublic: upload.isPublic,
          expiresAt: upload.expiresAt,
          createdAt: upload.createdAt,
        };
  }
}

interface BasicInfo {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
}

interface PublicInfo extends BasicInfo {
  canEdit: false;
}

interface PrivateInfo extends BasicInfo {
  canEdit: true;
  isPublic: boolean;
  expiresAt: Date | null;
  createdAt: Date;
}
