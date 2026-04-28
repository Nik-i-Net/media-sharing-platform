import type { UsersRepository } from '@/features/users/domain/users.repository';

export interface UnitOfWork {
  execute<T>(callback: (ctx: UnitOfWorkContext) => Promise<T>): Promise<T>;
}

export interface UnitOfWorkContext {
  get usersRepository(): UsersRepository;
  // get mediaRepository(): MediaRepository;
  // get collectionsRepository(): CollectionsRepository;
  // get subscriptionsRepository(): SubscriptionsRepository;
}
