import { Upload } from './upload';

export interface UploadsRepository {
  save(upload: Upload): Promise<void>;
  saveMany(uploads: Upload[]): Promise<void>;
  findById(id: string): Promise<Upload | null>;
  delete(id: string): Promise<{ isDeleted: true; blobId: string } | { isDeleted: false }>;

  findOwnershipData(ids: string[]): Promise<{ uploadId: string; userId: string }[]>;
}
