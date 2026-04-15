import type { IdentitiesRepository } from '@features/users/repositories/identities.repository';
import type { UsersRepository } from '@features/users/repositories/users.repository';

export interface UnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;

  get usersRepository(): UsersRepository;
  get identitiesRepository(): IdentitiesRepository;
}
