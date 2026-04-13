import { IdentitiesRepository } from '@features/users/repositories/identities.repository';
import { UsersRepository } from '@features/users/repositories/users.repository';
import type { Knex } from 'knex';

export interface UnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;

  getUsersRepository(): UsersRepository;
  getIdentitiesRepository(): IdentitiesRepository;
  // getBlobsRepository(): BlobsRepository;
  // getMediaRepository(): MediaRepository;
  // getCollectionsRepository(): CollectionsRepository;
}

export class KnexUnitOfWork implements UnitOfWork {
  private trx: Knex.Transaction | null = null;

  constructor(private readonly knex: Knex) {}

  public async begin(): Promise<void> {
    if (this.trx !== null) throw new Error('Transaction already started');
    this.trx = await this.knex.transaction();
  }

  public async commit(): Promise<void> {
    if (this.trx === null) throw new Error('Transaction not started');
    await this.trx.commit();
    this.trx = null;
  }

  public async rollback(): Promise<void> {
    if (this.trx === null) throw new Error('Transaction not started');
    await this.trx.rollback();
    this.trx = null;
  }

  public getUsersRepository(): UsersRepository {
    if (this.trx === null) throw new Error('Transaction not started');
    return new UsersRepository(this.trx);
  }

  public getIdentitiesRepository(): IdentitiesRepository {
    if (this.trx === null) throw new Error('Transaction not started');
    return new IdentitiesRepository(this.trx);
  }
}
