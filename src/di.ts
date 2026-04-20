import db from './shared/persistence/knex-client';
import { AuthCommandHandler } from './features/users/use-cases/auth.command';
import { KnexUnitOfWork } from './shared/persistence/knex-unit-of-work';

const uow = new KnexUnitOfWork(db);

// Services
// const storageService = new R2StorageService({
//   accountId: ENV.CLOUDFLARE_ACCOUNT_ID,
//   accessKeyId: ENV.CLOUDFLARE_ACCESS_KEY_ID,
//   secretAccessKey: ENV.CLOUDFLARE_SECRET_ACCESS_KEY,
//   bucket: ENV.CLOUDFLARE_BUCKET,
// });

// Users
// const identityRepository = new IdentitiesRepository(db);
// const usersRepository = new UsersRepository(db);
export const authCommandHandler = new AuthCommandHandler(uow);
