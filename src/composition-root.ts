import db from './infrastructure/persistence/knex-client';
import { UserService } from './application/user.service';
import { KnexUserRepository } from './infrastructure/repositories/knex-user.repository';
import { UserController } from './presentation/controllers/user.controller';
import { Argon2HashService } from './infrastructure/adapters/argon2-hash.service';
import { jwtConfig } from './config/jwt.config';
import { AuthService } from './application/auth.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { createJwtAuthMiddleware } from './presentation/middlewares/jwt-auth.middleware';
import { JoseTokenService } from './infrastructure/adapters/jose-token.service';
import { MediaController } from './presentation/controllers/media.controller';
import { MediaService } from './application/media.service';
import { R2StorageService } from './infrastructure/adapters/R2-storage.service';
import { ENV } from './config/env.loader';
import { authPolicy } from '@config/auth.policy';
import { mediaPolicy } from './config/media.policy';
import { KnexMediaRepository } from './infrastructure/repositories/knex-media.repository';
import { KnexBlobRepository } from './infrastructure/repositories/knex-blob.repository';

// Repositories
const userRepository = new KnexUserRepository(db);
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
const userService = new UserService(userRepository);
const authService = new AuthService(userRepository, hashService, tokenService, authPolicy);
const mediaService = new MediaService(mediaRepository, blobRepository, storageService, mediaPolicy);

// Controllers
const userController = new UserController(userService);
const authController = new AuthController(authService);
const mediaController = new MediaController(mediaService);

// Middlewares
const jwtAuth = createJwtAuthMiddleware(tokenService);

export { userController, authController, mediaController, jwtAuth };
