import type { IdentitiesRepository } from '@/features/users/repositories/identities.repository';
import type { UsersRepository } from '@/features/users/repositories/users.repository';

export interface UnitOfWork {
  execute<T>(callback: (repos: Repositories) => Promise<T>): Promise<T>;
}

export interface Repositories {
  get users(): UsersRepository;
  get identities(): IdentitiesRepository;
}
