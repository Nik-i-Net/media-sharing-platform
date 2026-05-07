import type { UsersRepository } from '@/features/users/domain/users.repository';
import { UserNotFoundError } from '@/features/users/errors/user-not-found.error';
import type { UnitOfWork } from '@/shared/ports/unit-of-work';
import type { Sha256Base64 } from '@/shared/schemas/primitives.zod';
import type { BlobRepository } from '../domain/blobs.repository';
import type { StorageService } from './ports/storage.provider';
import { BlobEntity } from '../domain/blob';

export interface InitiateUploadsCommand {
  userId: string;
  collectionId: string | null;
  files: {
    id: string;
    title: string;
    mimeType: string;
    sizeBytes: number;
    sha256Base64: Sha256Base64;
  }[];
}

type FileResult =
  | { id: string; uploadNeeded: false }
  | {
      id: string;
      uploadNeeded: true;
      url: string;
      method: 'PUT';
      headers: { [key: string]: string | number };
    };

export class InitiateUploadsUseCase {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly blobsRepo: BlobRepository,
    private readonly uow: UnitOfWork,
    private readonly storageService: StorageService,
  ) {}

  async execute({ userId, files, collectionId }: InitiateUploadsCommand) {
    const user = await this.usersRepo.findById(userId);
    if (!user) throw new UserNotFoundError();

    user.ensureCanUpload(files);

    const blobs = (
      await this.blobsRepo.findByHashes(files.map((file) => file.sha256Base64))
    ).filter((blob) => blob !== null);

    const result: FileResult[] = [];
    for (const file of files) {
      if (blobs.find((blob) => blob.hash === file.sha256Base64)) {
        result.push({ id: file.id, uploadNeeded: false });
      }

      const sha256Hex = Buffer.from(file.sha256Base64, 'base64').toString('hex');
      const key = `${sha256Hex.slice(0, 2)}/${sha256Hex.slice(2)}`;

      const blob = BlobEntity.create({
        storageKey: key,
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes,
        hash: file.sha256Base64,
      });
      blobs.push(blob);

      const url = await this.storageService.getUploadUrl({
        key,
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes,
        hash: file.sha256Base64,
      });

      result.push({
        id: file.id,
      });
    }

    // const payload = await Promise.all(
    //   files.map(async (file) => {
    //     const sha256Hex = Buffer.from(file.sha256Base64, 'base64').toString('hex');
    //     const url = await this.storageService.signUploadUrl({
    //       key: sha256Hex,
    //       mimeType: file.mimeType,
    //       sizeBytes: file.sizeBytes,
    //       hash: file.sha256Base64,
    //     });
    //
    //     return {
    //       id: file.id,
    //       url,
    //       method: 'PUT' as const,
    //       headers: {
    //         'Content-Type': file.mimeType,
    //         'Content-Length': file.sizeBytes,
    //         'x-amz-checksum-sha256': file.sha256Base64,
    //       },
    //     };
    //   }),
    // );

    return payload;
  }

  // { files: [{id, url, method, headers}] }
}
