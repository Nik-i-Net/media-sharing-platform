import type { AlbumsRepository } from '@/features/albums/domain/albums.repository';
import type { PaymentProfilesRepository } from '@/features/subscriptions/domain/payment-profiles.repository';
import type { SubscriptionsRepository } from '@/features/subscriptions/domain/subscriptions.repository';
import type { BlobsRepository } from '@/features/uploads/domain/blobs.repository';
import type { UploadsRepository } from '@/features/uploads/domain/uploads.repository';
import type { UserCountersRepository } from '@/features/users/domain/user-counters.repository';
import type { UsersRepository } from '@/features/users/domain/users.repository';

export interface UnitOfWork {
  execute<T>(callback: (ctx: UnitOfWorkContext) => Promise<T>): Promise<T>;
}

export interface UnitOfWorkContext {
  get usersRepository(): UsersRepository;
  get userCountersRepository(): UserCountersRepository;
  get blobsRepository(): BlobsRepository;
  get uploadsRepository(): UploadsRepository;
  get albumsRepository(): AlbumsRepository;
  get subscriptionsRepository(): SubscriptionsRepository;
  get paymentProfilesRepository(): PaymentProfilesRepository;
}
