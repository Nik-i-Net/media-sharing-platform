import type { Sha256Base64 } from '@/shared/schemas/primitives.zod';

export type UploadUrlParams = {
  key: string;
  mimeType: string;
  sizeBytes: number;
  hash: Sha256Base64;
};

export type UploadInfo = {
  url: string;
  method: 'PUT';
  headers: { [key: string]: string | number };
};

export interface StorageProvider {
  getDirectUploadInfo(params: UploadUrlParams): Promise<UploadInfo>;
  getDownloadUrl(key: string): Promise<string>;
}
