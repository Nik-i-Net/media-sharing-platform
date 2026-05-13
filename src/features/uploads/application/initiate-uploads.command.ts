import { UserNotFoundError } from '@/features/users/errors/user-not-found.error';
import { BlobEntity } from '../domain/blob';
import { Upload } from '../domain/upload';
import { AlbumNotFoundError } from '@/features/albums/errors/album-not-found.error';
import { ms, type Duration } from '@/shared/utils';
import type { UsersRepository } from '@/features/users/domain/users.repository';
import type { UnitOfWork } from '@/shared/ports/unit-of-work';
import type { Sha256Base64 } from '@/shared/schemas/primitives.zod';
import type { BlobsRepository } from '../domain/blobs.repository';
import type { StorageProvider } from './ports/storage.provider';
import type { AlbumsRepository } from '@/features/albums/domain/albums.repository';

export interface InitiateUploadsCommand {
  userId: string;
  albumId: string | null;
  files: {
    id: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    sha256Base64: Sha256Base64;
    ttl: Duration | null;
  }[];
}

type ResultItem =
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
    private readonly albumsRepo: AlbumsRepository,
    private readonly uow: UnitOfWork,
    private readonly storageProvider: StorageProvider,
  ) {}

  async execute({ userId, files, albumId }: InitiateUploadsCommand) {
    const user = await this.usersRepo.findById(userId);
    if (!user) throw new UserNotFoundError();

    if (albumId && !(await this.albumsRepo.existsById(albumId))) {
      throw new AlbumNotFoundError();
    }

    user.ensureCanUpload(files);

    const result: ResultItem[] = [];

    const fileHashes = files.map((file) => file.sha256Base64);
    const existingBlobs = await this.blobsRepo.findManyByHashes(fileHashes);

    const blobsToSave: BlobEntity[] = [];
    const uploadsToSave: Upload[] = [];
    const seenHashes = new Set();

    for (const file of files) {
      if (seenHashes.has(file.sha256Base64)) continue;
      seenHashes.add(file.sha256Base64);

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

        const uploadInfo = await this.storageProvider.getDirectUploadInfo({
          key,
          mimeType: file.mimeType,
          sizeBytes: file.sizeBytes,
          hash: file.sha256Base64,
        });

        result.push({ id: file.id, uploadNeeded: true, ...uploadInfo });
      }

      uploadsToSave.push(
        Upload.create({
          id: crypto.randomUUID(),
          userId: userId,
          blobId: blob.id,
          fileName: file.fileName,
          expiresAt: file.ttl ? new Date(Date.now() + ms(file.ttl)) : null,
        }),
      );
    }

    await this.uow.execute(async (ctx) => {
      if (blobsToSave.length > 0) {
        // TODO: think about race conditions and hash squatting
        await ctx.blobsRepository.saveMany(blobsToSave);
      }

      await ctx.uploadsRepository.saveMany(uploadsToSave);

      if (albumId) {
        await ctx.albumsRepository.addUploads(
          albumId,
          uploadsToSave.map((u) => u.id),
        );
      }
    });

    return result;
  }
}
