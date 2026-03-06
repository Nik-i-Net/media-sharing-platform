import type { BlobRepository } from '../domain/repositories/blob.repository';
import type { MediaRepository } from '../domain/repositories/media.repository';
import type { InitiateUploadsRequest } from './dto/request/initiate-uploads.request';
import type { StorageService } from './ports/storage.service';

export interface MediaPolicy {
  allowedMimeTypes: string[];
  fileSizeLimits: {
    guest: number;
    user: number;
    // premium: number;
  };
}

export class MediaService {
  constructor(
    private readonly mediaRepository: MediaRepository,
    private readonly blobRepository: BlobRepository,
    private readonly storageService: StorageService,
    private readonly policy: MediaPolicy,
  ) {}

  async getDownloadUrl(keys: string[]) {
    const urls = await Promise.all(
      keys.map((key) => {
        return this.storageService.signDownloadUrl(key);
      }),
    );
    return urls;
  }

  async initiateUploads(dto: InitiateUploadsRequest) {
    const { files, collectionId } = dto;
    console.log('TODO:', collectionId);

    const payload = await Promise.all(
      files.map(async (file) => {
        const { filename, mimeType, size, sha256base64 } = file;

        if (size > this.policy.fileSizeLimits.guest) {
          throw new Error('File size is too large');
        }

        const sha256hex = Buffer.from(sha256base64, 'base64').toString('hex');
        const key = `${sha256hex.slice(0, 2)}/${sha256hex.slice(2)}`;
        const url = await this.storageService.signUploadUrl(key, mimeType, size, sha256base64);
        console.log(filename, url);
        throw new Error('TODO');
      }),
    );

    return payload;

    // { files: [{id, url, method, headers}] }
  }

  async confirmUploads() {
    return 'Confirm uploads';
  }
}
