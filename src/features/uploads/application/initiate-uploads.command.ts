import { UserNotFoundError } from '@/features/users/errors/user-not-found.error';
import { BlobEntity } from '../domain/blob';
import { Upload } from '../domain/upload';
import { AlbumNotFoundError } from '@/features/albums/errors/album-not-found.error';
import { ms, type Duration } from '@/shared/utils';
import type { UsersRepository } from '@/features/users/domain/users.repository';
import type { UnitOfWork } from '@/shared/ports/unit-of-work';
import type { BlobsRepository } from '../domain/blobs.repository';
import type { StorageProvider } from './ports/storage.provider';
import type { AlbumsRepository } from '@/features/albums/domain/albums.repository';
import { HashVO } from '../domain/hash.value-object';

export interface InitiateUploadsCommand {
  userId: string;
  albumId: string | null;
  files: {
    id: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    sha256Hex: string;
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

    const fileHashes = files.map((file) => HashVO.fromHex(file.sha256Hex));
    const existingBlobs = await this.blobsRepo.findManyByHashes(fileHashes);

    const blobsToSave: BlobEntity[] = [];
    const uploadsToSave: Upload[] = [];
    const seenHashes = new Set();

    for (const file of files) {
      if (seenHashes.has(file.sha256Hex)) continue;
      seenHashes.add(file.sha256Hex);

      const hash = HashVO.fromHex(file.sha256Hex);
      let blob = existingBlobs.find((blob) => blob.hash === hash);

      if (blob) {
        result.push({ id: file.id, uploadNeeded: false });
      } else {
        blob = BlobEntity.create({
          id: crypto.randomUUID(),
          hash,
          mimeType: file.mimeType,
          sizeBytes: file.sizeBytes,
        });
        blobsToSave.push(blob);

        const uploadInfo = await this.storageProvider.getDirectUploadInfo({
          key: file.sha256Hex,
          hash: file.sha256Hex,
          mimeType: file.mimeType,
          sizeBytes: file.sizeBytes,
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
