import type { CollectionsRepository } from '@/features/collections/domain/collections.repository';
import type { BlobsRepository } from '@/features/media/domain/blobs.repository';
import type { MediaRepository } from '@/features/media/domain/media.repository';
import type { UsersRepository } from '@/features/users/domain/users.repository';

export interface UnitOfWork {
  execute<T>(callback: (ctx: UnitOfWorkContext) => Promise<T>): Promise<T>;
}

export interface UnitOfWorkContext {
  get usersRepository(): UsersRepository;
  get blobsRepository(): BlobsRepository;
  get mediaRepository(): MediaRepository;
  get collectionsRepository(): CollectionsRepository;
  // get subscriptionsRepository(): SubscriptionsRepository;
}
