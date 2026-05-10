import { UserNotFoundError } from '@/features/users/errors/user-not-found.error';
import { BlobEntity } from '../domain/blob';
import { Media } from '../domain/media';
import { CollectionNotFoundError } from '@/features/collections/errors/collection-not-found.error';
import { ms, type Duration } from '@/shared/utils';
import type { UsersRepository } from '@/features/users/domain/users.repository';
import type { UnitOfWork } from '@/shared/ports/unit-of-work';
import type { Sha256Base64 } from '@/shared/schemas/primitives.zod';
import type { BlobsRepository } from '../domain/blobs.repository';
import type { StorageService } from './ports/storage.provider';
import type { CollectionsRepository } from '@/features/collections/domain/collections.repository';

export interface InitiateUploadsCommand {
  userId: string;
  collectionId: string | null;
  files: {
    id: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    sha256Base64: Sha256Base64;
    ttl: Duration | null;
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
    private readonly blobsRepo: BlobsRepository,
    private readonly collectionsRepo: CollectionsRepository,
    private readonly uow: UnitOfWork,
    private readonly storageService: StorageService,
  ) {}

  async execute({ userId, files, collectionId }: InitiateUploadsCommand) {
    const user = await this.usersRepo.findById(userId);
    if (!user) throw new UserNotFoundError();

    if (collectionId && !(await this.collectionsRepo.existsById(collectionId))) {
      throw new CollectionNotFoundError();
    }

    user.ensureCanUpload(files);

    const result: FileResult[] = [];

    const fileHashes = files.map((file) => file.sha256Base64);
    const existingBlobs = await this.blobsRepo.findManyByHashes(fileHashes);

    const blobsToSave: BlobEntity[] = [];
    const mediaToSave: Media[] = [];

    for (const file of files) {
      let blob = existingBlobs.find((blob) => blob.hash === file.sha256Base64);

      if (blob) {
        result.push({ id: file.id, uploadNeeded: false });
      } else {
        const sha256Hex = Buffer.from(file.sha256Base64, 'base64').toString('hex');
        const key = `${sha256Hex.slice(0, 2)}/${sha256Hex.slice(2)}`;

        blob = BlobEntity.create({
          id: crypto.randomUUID(),
          storageKey: key,
          mimeType: file.mimeType,
          sizeBytes: file.sizeBytes,
          hash: file.sha256Base64,
        });
        blobsToSave.push(blob);

        const uploadInfo = await this.storageService.getUploadInfo({
          key,
          mimeType: file.mimeType,
          sizeBytes: file.sizeBytes,
          hash: file.sha256Base64,
        });

        result.push({ id: file.id, uploadNeeded: true, ...uploadInfo });
      }

      mediaToSave.push(
        Media.create({
          id: crypto.randomUUID(),
          userId: userId,
          blobId: blob.id,
          fileName: file.fileName,
          expiresAt: file.ttl ? new Date(Date.now() + ms(file.ttl)) : null,
        }),
      );
    }

    await this.uow.execute(async (ctx) => {
      await ctx.blobsRepository.saveMany(blobsToSave);
      await ctx.mediaRepository.saveMany(mediaToSave);

      if (collectionId) {
        await ctx.collectionsRepository.addMedia(
          collectionId,
          mediaToSave.map((media) => media.id),
        );
      }
    });

    return result;
  }
}
