import { IdentitiesRepository } from '@features/users/repositories/identities.repository';
import { UsersRepository } from '@features/users/repositories/users.repository';
import type { Knex } from 'knex';
import db from './knex-client';
import type { UnitOfWork } from '@shared/ports/unit-of-work';

export class UnitOfWorkFactory {
  static create(): UnitOfWork {
    return new KnexUnitOfWork(db);
  }
}

export class KnexUnitOfWork implements UnitOfWork {
  private trx: Knex.Transaction | null = null;
  private _usersRepository: UsersRepository | null = null;
  private _identitiesRepository: IdentitiesRepository | null = null;

  constructor(private readonly knex: Knex) {}

  async begin(): Promise<void> {
    if (this.trx !== null) throw new Error('Transaction already started');
    this.trx = await this.knex.transaction();
  }

  async commit(): Promise<void> {
    if (this.trx === null) throw new Error('Transaction not started');
    await this.trx.commit();
    this.reset();
  }

  async rollback(): Promise<void> {
    if (this.trx === null) throw new Error('Transaction not started');
    await this.trx.rollback();
    this.reset();
  }

  isInTransaction(): boolean {
    return this.trx !== null;
  }

  get usersRepository(): UsersRepository {
    if (this.trx === null) throw new Error('Transaction not started');
    if (this._usersRepository === null) {
      this._usersRepository = new UsersRepository(this.trx);
    }
    return this._usersRepository;
  }

  get identitiesRepository(): IdentitiesRepository {
    if (this.trx === null) throw new Error('Transaction not started');
    if (this._identitiesRepository === null) {
      this._identitiesRepository = new IdentitiesRepository(this.trx);
    }
    return this._identitiesRepository;
  }

  private reset(): void {
    this.trx = null;
    this._usersRepository = null;
    this._identitiesRepository = null;
  }
}
