import type { Sha256Base64 } from '../dto';

export interface StorageService {
  signUploadUrl(key: string, contentType: string, contentLength: number, hash: Sha256Base64): Promise<string>;
  signDownloadUrl(key: string): Promise<string>;
}
