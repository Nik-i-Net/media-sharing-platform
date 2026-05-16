import { ResolveUserIdUseCase } from './features/users/application/resolve-user-id';
import { ENV } from './shared/env.loader';
import { R2StorageProvider } from './features/uploads/infrastructure/R2-storage.provider';
import { InitiateUploadsUseCase } from './features/uploads/application/initiate-uploads.command';
import { db } from './shared/db/drizzle/client';
import { DrizzleUsersRepository } from './features/users/infrastructure/drizzle-users.repository';
import { DrizzlePlanProvider } from './features/users/infrastructure/drizzle-plan-provider';
import { DrizzleBlobsRepository } from './features/uploads/infrastructure/drizzle-blobs.repository';
import { DrizzleAlbumsRepository } from './features/albums/infrastructure/drizzle-albums.repository';
import { DrizzleUnitOfWork } from './shared/db/drizzle/drizzle-unit-of-work';
import { ConfirmUploadsUseCase } from './features/uploads/application/confirm-uploads.command';
import { GetUploadByIdUseCase } from './features/uploads/application/get-upload-by-id.query';

const unitOfWork = new DrizzleUnitOfWork(db);

export const plansProvider = new DrizzlePlanProvider(db);
const usersRepository = new DrizzleUsersRepository(db, plansProvider);
export const resolveUserId = new ResolveUserIdUseCase(usersRepository, plansProvider);

const storageProvider = new R2StorageProvider({
  accountId: ENV.CLOUDFLARE_ACCOUNT_ID,
  accessKeyId: ENV.CLOUDFLARE_ACCESS_KEY_ID,
  secretAccessKey: ENV.CLOUDFLARE_SECRET_ACCESS_KEY,
  bucket: ENV.CLOUDFLARE_BUCKET,
  downloadBaseUrl: ENV.MEDIA_BASE_URL,
});

const blobsRepository = new DrizzleBlobsRepository(db);
const albumsRepository = new DrizzleAlbumsRepository(db);

export const initiateUploads = new InitiateUploadsUseCase(
  usersRepository,
  blobsRepository,
  albumsRepository,
  unitOfWork,
  storageProvider,
);

export const confirmUploads = new ConfirmUploadsUseCase(blobsRepository);
export const getUploadById = new GetUploadByIdUseCase(db, storageProvider);
