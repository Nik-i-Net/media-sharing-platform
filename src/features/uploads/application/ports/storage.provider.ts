import type { BlobEntity } from '../../domain/blob';

export type UploadInfo = {
  url: string;
  method: 'PUT';
  headers: Record<string, string | number>;
};

export interface StorageProvider {
  getDirectUploadInfo(key: string, blob: BlobEntity): Promise<UploadInfo>;
  getDownloadUrl(key: string): Promise<string>;
}
