import db from '@core/persistence/knex-client';
import { ENV } from './config/env.loader';
import { authPolicy } from '@config/auth.policy';
import { mediaPolicy } from './config/media.policy';
import { createJwtAuthMiddleware } from '@common/middlewares/jwt-auth.middleware';
import { jwtConfig } from '@config/jwt.config';
import { Argon2HashService } from '@core/services/argon2-hash.service';
import { JoseTokenService } from '@core/services/jose-token.service';
import { R2StorageService } from '@core/services/R2-storage.service';
import { AuthController } from '@features/auth/auth.controller';
import { AuthService } from '@features/auth/auth.service';
import { KnexBlobRepository } from '@features/media/knex-blob.repository';
import { KnexMediaRepository } from '@features/media/knex-media.repository';
import { MediaController } from '@features/media/media.controller';
import { MediaService } from '@features/media/media.service';
import { UsersController } from '@features/users/users.controller';
import { KnexUsersRepository } from '@features/users/users.repository';
import { UsersService } from '@features/users/users.service';

// Users
const usersRepository = new KnexUsersRepository(db);
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

// Repositories
const blobRepository = new KnexBlobRepository(db);
const mediaRepository = new KnexMediaRepository(db);

// Application services
const hashService = new Argon2HashService();
const tokenService = new JoseTokenService(jwtConfig);
const storageService = new R2StorageService({
  accountId: ENV.CLOUDFLARE_ACCOUNT_ID,
  accessKeyId: ENV.CLOUDFLARE_ACCESS_KEY_ID,
  secretAccessKey: ENV.CLOUDFLARE_SECRET_ACCESS_KEY,
  bucket: ENV.CLOUDFLARE_BUCKET,
});

// Use cases
const authService = new AuthService(usersRepository, hashService, tokenService, authPolicy);
const mediaService = new MediaService(mediaRepository, blobRepository, storageService, mediaPolicy);

// Controllers
const authController = new AuthController(authService);
const mediaController = new MediaController(mediaService);

// Middlewares
const jwtAuth = createJwtAuthMiddleware(tokenService);

export { usersController, authController, mediaController, jwtAuth };
