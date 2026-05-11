import type { AlbumsRepository } from '@/features/albums/domain/albums.repository';
import type { BlobsRepository } from '@/features/uploads/domain/blobs.repository';
import type { UploadsRepository } from '@/features/uploads/domain/uploads.repository';
import type { UsersRepository } from '@/features/users/domain/users.repository';

export interface UnitOfWork {
  execute<T>(callback: (ctx: UnitOfWorkContext) => Promise<T>): Promise<T>;
}

export interface UnitOfWorkContext {
  get usersRepository(): UsersRepository;
  get blobsRepository(): BlobsRepository;
  get uploadsRepository(): UploadsRepository;
  get albumsRepository(): AlbumsRepository;
  // get subscriptionsRepository(): SubscriptionsRepository;
}
