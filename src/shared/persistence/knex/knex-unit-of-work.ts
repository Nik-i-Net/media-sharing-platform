import { KnexUsersRepository } from '@/features/users/repositories/knex-users.repository';
import type { UnitOfWork, UnitOfWorkContext } from '@/shared/ports/unit-of-work';
import type { Knex } from 'knex';

export class KnexUnitOfWork implements UnitOfWork {
  constructor(private readonly db: Knex) {}

  async execute<T>(work: (ctx: KnexUnitOfWorkContext) => Promise<T>): Promise<T> {
    return await this.db.transaction(async (trx) => {
      const ctx = new KnexUnitOfWorkContext(trx);
      return await work(ctx);
    });
  }
}

export class KnexUnitOfWorkContext implements UnitOfWorkContext {
  private _usersRepository?: KnexUsersRepository;

  constructor(private readonly trx: Knex.Transaction) {}

  get usersRepository(): KnexUsersRepository {
    return (this._usersRepository ??= new KnexUsersRepository(this.trx));
  }
}
