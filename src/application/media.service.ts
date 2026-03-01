import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ENV } from '@config/env.loader';

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${ENV.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ENV.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: ENV.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
});

const key = 'first-image.png';
// const hash = crypto.createHash('sha256').update(fileBuffer).digest('base64');

class MediaService {
  constructor() {}

  async getDownloadUrl() {
    const getUrl = await getSignedUrl(
      S3, //
      new GetObjectCommand({ Bucket: ENV.CLOUDFLARE_BUCKET, Key: key }),
      { expiresIn: 30 },
    );

    return getUrl;
  }

  async initiateUploads() {
    const putUrl = await getSignedUrl(
      S3,
      new PutObjectCommand({
        Bucket: ENV.CLOUDFLARE_BUCKET,
        Key: 'image.png',
        ContentType: 'image/png',
      }),
      {
        expiresIn: 300,
        signableHeaders: new Set(['content-type']),
      },
    );

    return putUrl;
  }

  async confirmUploads() {
    return 'Confirm uploads';
  }
}

export { MediaService };
