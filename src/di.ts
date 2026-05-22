import { ResolveUserIdCommandHandler } from './features/users/application/resolve-user-id';
import { ENV } from './shared/env.loader';
import { R2StorageProvider } from './features/uploads/infrastructure/R2-storage.provider';
import { InitiateUploadsCommandHandler } from './features/uploads/application/initiate-uploads.command';
import { db } from './shared/db/drizzle/client';
import { DrizzleUsersRepository } from './features/users/infrastructure/drizzle-users.repository';
import { DrizzlePlanProvider } from './features/users/infrastructure/drizzle-plan-provider';
import { DrizzleBlobsRepository } from './features/uploads/infrastructure/drizzle-blobs.repository';
import { DrizzleAlbumsRepository } from './features/albums/infrastructure/drizzle-albums.repository';
import { DrizzleUnitOfWork } from './shared/db/drizzle/drizzle-unit-of-work';
import { ConfirmUploadsCommandHandler } from './features/uploads/application/confirm-uploads.command';
import { GetUploadByIdQueryHandler } from './features/uploads/application/get-upload-by-id.query';
import { ListUserUploadsQueryHandler } from './features/uploads/application/list-user-uploads.query';
import { CreateAlbumCommandHandler } from './features/albums/application/create-album.command';
import { DeleteAlbumCommandHandler } from './features/albums/application/delete-album.command';
import { GetAlbumByIdQueryHandler } from './features/albums/application/get-album-by-id.query';

const unitOfWork = new DrizzleUnitOfWork(db);

export const plansProvider = new DrizzlePlanProvider(db);
const usersRepository = new DrizzleUsersRepository(db, plansProvider);
export const resolveUserId = new ResolveUserIdCommandHandler(usersRepository, plansProvider);

const storageProvider = new R2StorageProvider({
  accountId: ENV.CLOUDFLARE_ACCOUNT_ID,
  accessKeyId: ENV.CLOUDFLARE_ACCESS_KEY_ID,
  secretAccessKey: ENV.CLOUDFLARE_SECRET_ACCESS_KEY,
  bucket: ENV.CLOUDFLARE_BUCKET,
  downloadBaseUrl: ENV.MEDIA_BASE_URL,
});

const blobsRepository = new DrizzleBlobsRepository(db);
const albumsRepository = new DrizzleAlbumsRepository(db);

export const initiateUploads = new InitiateUploadsCommandHandler(
  usersRepository,
  blobsRepository,
  albumsRepository,
  unitOfWork,
  storageProvider,
);

export const confirmUploads = new ConfirmUploadsCommandHandler(blobsRepository);
export const getUploadById = new GetUploadByIdQueryHandler(db, storageProvider);
export const listUserUploads = new ListUserUploadsQueryHandler(db, storageProvider);

export const createAlbum = new CreateAlbumCommandHandler(albumsRepository);
export const getAlbumById = new GetAlbumByIdQueryHandler(db);
export const deleteAlbum = new DeleteAlbumCommandHandler(albumsRepository);
