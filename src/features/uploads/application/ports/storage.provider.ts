import type { BlobEntity } from '../../domain/blob';
import type { HashVO } from '../../domain/hash.value-object';

export type UploadInfo = {
  url: string;
  method: 'PUT';
  headers: Record<string, string | number>;
};

export interface StorageProvider {
  getDirectUploadInfo(blob: BlobEntity): Promise<UploadInfo>;
  getDownloadUrl(hash: HashVO): string;
  getPreviewUrl(hash: HashVO): string;
}
