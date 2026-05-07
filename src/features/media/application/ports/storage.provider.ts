import type { Sha256Base64 } from '@/shared/schemas/primitives.zod';

export type UploadUrlParams = {
  key: string;
  mimeType: string;
  sizeBytes: number;
  hash: Sha256Base64;
};

export interface StorageService {
  getUploadUrl(params: UploadUrlParams): Promise<string>;
  getDownloadUrl(key: string): Promise<string>;
}
