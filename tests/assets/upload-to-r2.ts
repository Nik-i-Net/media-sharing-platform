import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createHash } from 'crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const assetsPath = resolve(process.cwd(), 'tests/assets');
export const uploadedBlobsMetadataPath = `${assetsPath}/uploaded-blobs-meta.json`;
export type UploadedBlobsMetadata = { sha256Hex: string; mimeType: string; sizeBytes: number }[];

export async function uploadTestAssetsToR2() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;
  const bucket = process.env.CLOUDFLARE_BUCKET;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error('Missing env vars');
  }

  const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  async function upload(filePath: string, mimeType: string) {
    const buf = await readFile(filePath);
    const hash = createHash('sha256').update(buf);
    const sha256Hex = hash.copy().digest('hex');
    const sha256Base64 = hash.digest('base64');
    const sizeBytes = buf.length;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: sha256Hex,
      ContentType: mimeType,
      ContentLength: sizeBytes,
      ChecksumSHA256: sha256Base64,
      Body: buf,
    });

    await r2Client.send(command);
    console.log(`uploaded ${filePath}`);

    return { sha256Hex, mimeType, sizeBytes };
  }

  const uploadedBlobsMetadata: UploadedBlobsMetadata = await Promise.all([
    upload(`${assetsPath}/image.png`, 'image/png'),
    upload(`${assetsPath}/image.jpg`, 'image/jpeg'),
    upload(`${assetsPath}/audio.ogg`, 'audio/ogg'),
  ]);

  await writeFile(
    `${assetsPath}/uploaded-blobs-meta.json`,
    JSON.stringify(uploadedBlobsMetadata, null, 2),
    'utf-8',
  );

  console.log(`uploaded blobs metadata saved to ${uploadedBlobsMetadataPath}`);
}

if (process.argv[1] === import.meta.filename) {
  await uploadTestAssetsToR2();
}
