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
import { TodoError } from '@/shared/errors';

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
  // TODO: implement 'rejected' and 'skipped_already_exists'
  | { id: string; status: 'ok' }
  | {
      id: string;
      status: 'upload_required';
      url: string;
      method: 'PUT';
      headers: { [key: string]: string | number };
    };

export class InitiateUploadsCommandHandler {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly blobsRepo: BlobsRepository,
    private readonly albumsRepo: AlbumsRepository,
    private readonly uow: UnitOfWork,
    private readonly storageProvider: StorageProvider,
  ) {}

  async execute({ userId, albumId, files }: InitiateUploadsCommand): Promise<ResultItem[]> {
    const user = await this.usersRepo.findById(userId);
    if (!user) throw new UserNotFoundError();

    if (albumId && !(await this.albumsRepo.existsById(albumId))) {
      throw new AlbumNotFoundError();
    }

    user.ensureCanUpload(files);

    const result: ResultItem[] = [];
    const fileHashes = files.map((file) => HashVO.fromHex(file.sha256Hex));
    const blobsByHashHex = new Map(
      (await this.blobsRepo.findManyByHashes(fileHashes)).map((b) => [b.hash.hex, b]),
    );

    const blobsToSave: BlobEntity[] = [];
    const uploadsToSave: Upload[] = [];

    for (const file of files) {
      let blob = blobsByHashHex.get(file.sha256Hex);
      if (!blob) {
        blob = BlobEntity.create({
          id: crypto.randomUUID(),
          hash: HashVO.fromHex(file.sha256Hex),
          mimeType: file.mimeType,
          sizeBytes: file.sizeBytes,
        });
        blobsToSave.push(blob);
        blobsByHashHex.set(file.sha256Hex, blob);
      }

      switch (blob.status) {
        case 'pending': {
          const uploadInfo = await this.storageProvider.getDirectUploadInfo(file.sha256Hex, blob);
          result.push({ id: file.id, status: 'upload_required', ...uploadInfo });
          break;
        }
        case 'ready':
          result.push({ id: file.id, status: 'ok' });
          break;
        case 'rejected':
          throw new TodoError(`Upload ${file.id} rejected`);
        default:
          throw new Error(`Unexpected blob status: ${blob.status satisfies never}`);
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
        await ctx.albumsRepository.linkUploads(
          albumId,
          uploadsToSave.map((u) => u.id),
        );
      }
    });

    return result;
  }
}
