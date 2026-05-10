import { DrizzleUsersRepository } from '@/features/users/infrastructure/drizzle-users.repository';
import type { UnitOfWork, UnitOfWorkContext } from '@/shared/ports/unit-of-work';
import type { DrizzleDB, DrizzleTransaction } from './client';
import { DrizzleCollectionsRepository } from '@/features/collections/infrastructure/drizzle-collections.repository';
import { DrizzleBlobsRepository } from '@/features/media/infrastructure/drizzle-blobs.repository';
import { DrizzleMediaRepository } from '@/features/media/infrastructure/drizzle-media.repository';
import { plansProvider } from '@/di';

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
  private _blobsRepository?: DrizzleBlobsRepository;
  private _mediaRepository?: DrizzleMediaRepository;
  private _collectionsRepository?: DrizzleCollectionsRepository;

  constructor(private readonly trx: DrizzleTransaction) {}

  get usersRepository(): DrizzleUsersRepository {
    return (this._usersRepository ??= new DrizzleUsersRepository(this.trx, plansProvider));
  }
  get blobsRepository(): DrizzleBlobsRepository {
    return (this._blobsRepository ??= new DrizzleBlobsRepository(this.trx));
  }
  get mediaRepository(): DrizzleMediaRepository {
    return (this._mediaRepository ??= new DrizzleMediaRepository(this.trx));
  }
  get collectionsRepository(): DrizzleCollectionsRepository {
    return (this._collectionsRepository ??= new DrizzleCollectionsRepository(this.trx));
  }
}
