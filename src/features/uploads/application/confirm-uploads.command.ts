import { requireDefined } from '@/shared/utils';
import type { BlobsRepository } from '../domain/blobs.repository';
import { HashVO } from '../domain/hash.value-object';

type MimeType = string | null;
interface UploadInfo {
  key: string;
  mimeType: MimeType;
}

export class ConfirmUploadsUseCase {
  constructor(private readonly blobsRepo: BlobsRepository) {}

  async execute(uploads: UploadInfo[]) {
    const hashes: HashVO[] = [];
    const mimeByKey = new Map<string, MimeType>();
    uploads.forEach((u) => {
      hashes.push(HashVO.fromHex(u.key));
      mimeByKey.set(u.key, u.mimeType);
    });

    const blobs = await this.blobsRepo.findManyByHashes(hashes);
    blobs.forEach((blob) => {
      const mimeType = requireDefined(mimeByKey.get(blob.hash.hex));
      blob.confirm(mimeType);
    });

    await this.blobsRepo.saveMany(blobs);
  }
}
