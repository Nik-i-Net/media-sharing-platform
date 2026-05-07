import { DrizzleUsersRepository } from '@/features/users/infrastructure/drizzle-users.repository';
import type { UnitOfWork, UnitOfWorkContext } from '@/shared/ports/unit-of-work';
import type { DrizzleDB, DrizzleTransaction } from './client';

export class DrizzleUnitOfWork implements UnitOfWork {
  constructor(private readonly db: DrizzleDB) {}

  async execute<T>(work: (ctx: DrizzleUnitOfWorkContext) => Promise<T>): Promise<T> {
    return await this.db.transaction(async (trx) => {
      const ctx = new DrizzleUnitOfWorkContext(trx);
      return await work(ctx);
    });
  }
}

export class DrizzleUnitOfWorkContext implements UnitOfWorkContext {
  private _usersRepository?: DrizzleUsersRepository;

  constructor(private readonly trx: DrizzleTransaction) {}

  get usersRepository(): DrizzleUsersRepository {
    return (this._usersRepository ??= new DrizzleUsersRepository(this.trx));
  }
}
