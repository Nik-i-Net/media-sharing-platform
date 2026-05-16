import type { DrizzleDB } from '@/shared/db/drizzle/client';
import type { StorageProvider } from './ports/storage.provider';
import { eq } from 'drizzle-orm';
import { uploadsTable } from '@/shared/db/drizzle/schema';
import { UploadNotFoundError } from '../errors/upload-not-found.error';

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
  updatedAt: Date;
}

export class GetUploadByIdUseCase {
  constructor(
    private readonly db: DrizzleDB,
    private readonly storageProvider: StorageProvider,
  ) {}

  async execute(uploadId: string, userId: string | null): Promise<PublicInfo | PrivateInfo> {
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
      url: await this.storageProvider.getDownloadUrl(upload.blob.hash.hex),
    };

    return userId !== upload.userId
      ? { ...basicInfo, canEdit: false }
      : {
          ...basicInfo,
          canEdit: true,
          isPublic: upload.isPublic,
          expiresAt: upload.expiresAt,
          createdAt: upload.createdAt,
          updatedAt: upload.updatedAt,
        };
  }
}
