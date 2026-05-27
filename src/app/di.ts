import { CreateAlbumCommandHandler } from '@/features/albums/application/create-album.command';
import { DeleteAlbumCommandHandler } from '@/features/albums/application/delete-album.command';
import { GetAlbumByIdQueryHandler } from '@/features/albums/application/get-album-by-id.query';
import { LinkUploadsToAlbumCommandHandler } from '@/features/albums/application/link-uploads-to-album.command';
import { ListAlbumUploadsQueryHandler } from '@/features/albums/application/list-album-uploads.query';
import { ListUserAlbumsQueryHandler } from '@/features/albums/application/list-user-albums.query';
import { UnlinkUploadsFromAlbumCommandHandler } from '@/features/albums/application/unlink-uploads-from-album.command';
import { UpdateAlbumCommandHandler } from '@/features/albums/application/update-album.command';
import { DrizzleAlbumsRepository } from '@/features/albums/infrastructure/drizzle-albums.repository';
import { ConfirmUploadsCommandHandler } from '@/features/uploads/application/confirm-uploads.command';
import { DeleteUploadCommandHandler } from '@/features/uploads/application/delete-upload.command';
import { GetUploadByIdQueryHandler } from '@/features/uploads/application/get-upload-by-id.query';
import { InitiateUploadsCommandHandler } from '@/features/uploads/application/initiate-uploads.command';
import { ListUserUploadsQueryHandler } from '@/features/uploads/application/list-user-uploads.query';
import { UpdateUploadInfoCommandHandler } from '@/features/uploads/application/update-upload-info.command';
import { DrizzleBlobsRepository } from '@/features/uploads/infrastructure/drizzle-blobs.repository';
import { DrizzleUploadsRepository } from '@/features/uploads/infrastructure/drizzle-uploads.repository';
import { R2StorageProvider } from '@/features/uploads/infrastructure/R2-storage.provider';
import { ResolveUserIdCommandHandler } from '@/features/users/application/resolve-user-id';
import { DrizzlePlanProvider } from '@/features/users/infrastructure/drizzle-plan-provider';
import { DrizzleUserCountersRepository } from '@/features/users/infrastructure/drizzle-user-counters.repository';
import { DrizzleUsersRepository } from '@/features/users/infrastructure/drizzle-users.repository';
import { db } from '@/shared/db/drizzle/client';
import { DrizzleUnitOfWork } from '@/shared/db/drizzle/drizzle-unit-of-work';
import { ENV } from '@/shared/env.loader';

const unitOfWork = new DrizzleUnitOfWork(db);

export const plansProvider = new DrizzlePlanProvider(db);

const usersRepository = new DrizzleUsersRepository(db, plansProvider);
const userCountersRepository = new DrizzleUserCountersRepository(db);
const blobsRepository = new DrizzleBlobsRepository(db);
const uploadsRepository = new DrizzleUploadsRepository(db);
const albumsRepository = new DrizzleAlbumsRepository(db);

export const resolveUserId = new ResolveUserIdCommandHandler(usersRepository, unitOfWork);

const storageProvider = new R2StorageProvider({
  accountId: ENV.CLOUDFLARE_ACCOUNT_ID,
  accessKeyId: ENV.CLOUDFLARE_ACCESS_KEY_ID,
  secretAccessKey: ENV.CLOUDFLARE_SECRET_ACCESS_KEY,
  bucket: ENV.CLOUDFLARE_BUCKET,
  downloadBaseUrl: ENV.MEDIA_BASE_URL,
});

export const initiateUploads = new InitiateUploadsCommandHandler(
  usersRepository,
  blobsRepository,
  albumsRepository,
  unitOfWork,
  storageProvider,
);

export const confirmUploads = new ConfirmUploadsCommandHandler(blobsRepository);
export const getUploadById = new GetUploadByIdQueryHandler(db, storageProvider);
export const listUserUploads = new ListUserUploadsQueryHandler(
  db,
  userCountersRepository,
  storageProvider,
);
export const updateUploadInfo = new UpdateUploadInfoCommandHandler(uploadsRepository);
export const deleteUpload = new DeleteUploadCommandHandler(uploadsRepository);

export const createAlbum = new CreateAlbumCommandHandler(albumsRepository);
export const listUserAlbums = new ListUserAlbumsQueryHandler(db, userCountersRepository);
export const getAlbumById = new GetAlbumByIdQueryHandler(db);
export const listAlbumUploads = new ListAlbumUploadsQueryHandler(db, storageProvider);
export const updateAlbum = new UpdateAlbumCommandHandler(albumsRepository);
export const deleteAlbum = new DeleteAlbumCommandHandler(albumsRepository);
export const linkUploadsToAlbum = new LinkUploadsToAlbumCommandHandler(
  albumsRepository,
  uploadsRepository,
);
export const unlinkUploadsFromAlbum = new UnlinkUploadsFromAlbumCommandHandler(albumsRepository);
