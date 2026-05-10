import { ResolveUserIdUseCase } from './features/users/application/resolve-user-id';
import { ENV } from './config/env.loader';
import { R2StorageService } from './features/media/infrastructure/R2-storage.provider';
import { InitiateUploadsUseCase } from './features/media/application/initiate-uploads.command';
import { db } from './shared/persistence/drizzle/client';
import { DrizzleUsersRepository } from './features/users/infrastructure/drizzle-users.repository';
import { DrizzlePlanProvider } from './features/users/infrastructure/drizzle-plan-provider';
import { DrizzleBlobsRepository } from './features/media/infrastructure/drizzle-blobs.repository';
import { DrizzleCollectionsRepository } from './features/collections/infrastructure/drizzle-collections.repository';
import { DrizzleUnitOfWork } from './shared/persistence/drizzle/drizzle-unit-of-work';

const unitOfWork = new DrizzleUnitOfWork(db);

// Users
export const plansProvider = new DrizzlePlanProvider(db);
const usersRepository = new DrizzleUsersRepository(db, plansProvider);
export const resolveUserId = new ResolveUserIdUseCase(usersRepository);

// Media
const storageService = new R2StorageService({
  accountId: ENV.CLOUDFLARE_ACCOUNT_ID,
  accessKeyId: ENV.CLOUDFLARE_ACCESS_KEY_ID,
  secretAccessKey: ENV.CLOUDFLARE_SECRET_ACCESS_KEY,
  bucket: ENV.CLOUDFLARE_BUCKET,
  downloadBaseUrl: ENV.MEDIA_BASE_URL,
});

const blobsRepository = new DrizzleBlobsRepository(db);
// const mediaRepository = new DrizzleMediaRepository(db);
const collectionsRepository = new DrizzleCollectionsRepository(db);

export const initiateUploads = new InitiateUploadsUseCase(
  usersRepository,
  blobsRepository,
  collectionsRepository,
  unitOfWork,
  storageService,
);
