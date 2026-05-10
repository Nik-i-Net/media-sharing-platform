import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type {
  StorageService,
  UploadUrlParams,
  UploadInfo,
} from '../application/ports/storage.provider';

type R2Params = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  downloadBaseUrl: string;
};

export class R2StorageService implements StorageService {
  private readonly S3: S3Client;
  private readonly bucket: string;
  private readonly downloadBaseUrl: string;

  constructor({ accountId, accessKeyId, secretAccessKey, bucket, downloadBaseUrl }: R2Params) {
    this.S3 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
    this.bucket = bucket;
    this.downloadBaseUrl = downloadBaseUrl;
  }

  async getUploadInfo({ key, mimeType, sizeBytes, hash }: UploadUrlParams): Promise<UploadInfo> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: mimeType,
      ContentLength: sizeBytes,
      ChecksumSHA256: hash,
    });

    const url = await getSignedUrl(this.S3, command, {
      expiresIn: 300,
      signableHeaders: new Set(['content-type', 'content-length']),
      unhoistableHeaders: new Set(['x-amz-checksum-sha256']),
    });

    return {
      url,
      method: 'PUT',
      headers: {
        'Content-Type': mimeType,
        'Content-Length': sizeBytes,
        'x-amz-checksum-sha256': hash,
      },
    };
  }

  async getDownloadUrl(key: string) {
    return `${this.downloadBaseUrl}/${key}`;
  }
}

