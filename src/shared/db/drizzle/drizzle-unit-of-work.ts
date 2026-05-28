import { DrizzleUsersRepository } from '@/features/users/infrastructure/drizzle-users.repository';
import type { UnitOfWork, UnitOfWorkContext } from '@/shared/ports/unit-of-work';
import type { DrizzleDB, DrizzleTransaction } from './client';
import { DrizzleAlbumsRepository } from '@/features/albums/infrastructure/drizzle-albums.repository';
import { DrizzleBlobsRepository } from '@/features/uploads/infrastructure/drizzle-blobs.repository';
import { DrizzleUploadsRepository } from '@/features/uploads/infrastructure/drizzle-uploads.repository';
import { DrizzleUserCountersRepository } from '@/features/users/infrastructure/drizzle-user-counters.repository';
import { plansProvider } from '@/app/di';
import { DrizzlePaymentProfilesRepository } from '@/features/subscriptions/infrastructure/drizzle-payment-profiles.repository';
import { DrizzleSubscriptionsRepository } from '@/features/subscriptions/infrastructure/drizzle-subscriptions.repository';

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
  private _userCountersRepository?: DrizzleUserCountersRepository;
  private _blobsRepository?: DrizzleBlobsRepository;
  private _uploadsRepository?: DrizzleUploadsRepository;
  private _albumsRepository?: DrizzleAlbumsRepository;
  private _subscriptionsRepository?: DrizzleSubscriptionsRepository;
  private _paymentProfilesRepository?: DrizzlePaymentProfilesRepository;

  constructor(private readonly trx: DrizzleTransaction) {}

  get usersRepository(): DrizzleUsersRepository {
    return (this._usersRepository ??= new DrizzleUsersRepository(this.trx, plansProvider));
  }
  get userCountersRepository(): DrizzleUserCountersRepository {
    return (this._userCountersRepository ??= new DrizzleUserCountersRepository(this.trx));
  }
  get blobsRepository(): DrizzleBlobsRepository {
    return (this._blobsRepository ??= new DrizzleBlobsRepository(this.trx));
  }
  get uploadsRepository(): DrizzleUploadsRepository {
    return (this._uploadsRepository ??= new DrizzleUploadsRepository(this.trx));
  }
  get albumsRepository(): DrizzleAlbumsRepository {
    return (this._albumsRepository ??= new DrizzleAlbumsRepository(this.trx));
  }
  get subscriptionsRepository(): DrizzleSubscriptionsRepository {
    return (this._subscriptionsRepository ??= new DrizzleSubscriptionsRepository(this.trx));
  }
  get paymentProfilesRepository(): DrizzlePaymentProfilesRepository {
    return (this._paymentProfilesRepository ??= new DrizzlePaymentProfilesRepository(this.trx));
  }
}
