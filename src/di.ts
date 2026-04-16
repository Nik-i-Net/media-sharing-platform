import db from './shared/persistence/knex-client';
import { ENV } from './config/env.loader';
import { R2StorageService } from './shared/services/R2-storage.service';
import { KnexBlobRepository } from '@features/media/knex-blob.repository';
import { KnexMediaRepository } from '@features/media/knex-media.repository';
import { MediaService } from '@features/media/media.service';
import { AuthCommandHandler } from '@features/users/use-cases/auth.command';
// import { UsersRepository } from '@features/users/repositories/users.repository';
// import { IdentitiesRepository } from '@features/users/repositories/identities.repository';
import { KnexUnitOfWork } from '@shared/persistence/knex-unit-of-work';
import { mediaPolicy } from '@features/media/media.policy';

const uow = new KnexUnitOfWork(db);

// Services
const storageService = new R2StorageService({
  accountId: ENV.CLOUDFLARE_ACCOUNT_ID,
  accessKeyId: ENV.CLOUDFLARE_ACCESS_KEY_ID,
  secretAccessKey: ENV.CLOUDFLARE_SECRET_ACCESS_KEY,
  bucket: ENV.CLOUDFLARE_BUCKET,
});

// Users
// const identityRepository = new IdentitiesRepository(db);
// const usersRepository = new UsersRepository(db);
export const authCommandHandler = new AuthCommandHandler(uow);

// Media
const blobRepository = new KnexBlobRepository(db);
const mediaRepository = new KnexMediaRepository(db);
export const mediaService = new MediaService(
  mediaRepository,
  blobRepository,
  storageService,
  mediaPolicy,
);
