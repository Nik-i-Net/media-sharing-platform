import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import type { StorageService } from '../../application/ports/storage.service';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { Sha256Base64 } from '../../application/dto';

export class R2StorageService implements StorageService {
  private readonly S3: S3Client;
  private readonly bucket: string;

  constructor(accountId: string, accessKeyId: string, secretAccessKey: string, bucket: string) {
    this.S3 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
    this.bucket = bucket;
  }

  async signUploadUrl(key: string, contentType: string, contentLength: number, hash: Sha256Base64) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
      ContentLength: contentLength,
      ChecksumSHA256: hash,
    });

    const url = await getSignedUrl(this.S3, command, {
      expiresIn: 300,
      signableHeaders: new Set(['content-type', 'content-length']),
      unhoistableHeaders: new Set(['x-amz-checksum-sha256']),
    });

    return url;
  }

  async signDownloadUrl(key: string) {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    const url = await getSignedUrl(this.S3, command, { expiresIn: 300 });
    return url;
  }
}
