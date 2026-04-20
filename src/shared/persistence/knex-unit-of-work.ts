import { IdentitiesRepository } from '@/features/users/repositories/identities.repository';
import { UsersRepository } from '@/features/users/repositories/users.repository';
import type { Knex } from 'knex';
import type { UnitOfWork, Repositories } from '../ports/unit-of-work';

export class KnexUnitOfWork implements UnitOfWork {
  constructor(private readonly db: Knex | Knex.Transaction) {}

  async execute<T>(work: (repos: Repositories) => Promise<T>): Promise<T> {
    const repos = new KnexRepositories(this.db);
    return work(repos);
  }
}

export class KnexRepositories implements Repositories {
  private _users?: UsersRepository;
  private _identities?: IdentitiesRepository;

  constructor(private readonly db: Knex | Knex.Transaction) {}

  get users(): UsersRepository {
    return (this._users ??= new UsersRepository(this.db));
  }

  get identities(): IdentitiesRepository {
    return (this._identities ??= new IdentitiesRepository(this.db));
  }
}
