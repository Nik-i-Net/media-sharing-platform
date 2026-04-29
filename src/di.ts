import { ResolveUserIdUseCase } from './features/users/use-cases/resolve-user-id';
import { ENV } from './config/env.loader';
import { R2StorageService } from './features/media/infrastructure/R2-storage.service';
import { InitiateUploadsCommandHandler } from './features/media/use-cases/initiate-uploads.command';
// import { DrizzleUnitOfWork } from './shared/persistence/drizzle/drizzle-unit-of-work';
import { db } from './shared/persistence/drizzle/client';
import { DrizzleUsersRepository } from './features/users/repositories/drizzle-users.repository';

// const uow = new DrizzleUnitOfWork(db);

// Users
const usersRepository = new DrizzleUsersRepository(db);
export const resolveUserId = new ResolveUserIdUseCase(usersRepository);

// Media
const storageService = new R2StorageService({
  accountId: ENV.CLOUDFLARE_ACCOUNT_ID,
  accessKeyId: ENV.CLOUDFLARE_ACCESS_KEY_ID,
  secretAccessKey: ENV.CLOUDFLARE_SECRET_ACCESS_KEY,
  bucket: ENV.CLOUDFLARE_BUCKET,
});
export const initiateUploadsCommandHandler = new InitiateUploadsCommandHandler(storageService);
