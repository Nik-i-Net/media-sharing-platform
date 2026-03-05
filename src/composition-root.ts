import db from './infrastructure/persistence/knex-client';
import { UserService } from './application/user.service';
import { KnexUserRepository } from './infrastructure/repositories/knex-user.repository';
import { UserController } from './presentation/controllers/user.controller';
import { Argon2HashService } from './infrastructure/adapters/argon2-hash.service';
import { jwtConfig } from './@config/jwt.config';
import { AuthService } from './application/auth.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { createJwtAuthMiddleware } from './presentation/middlewares/jwt-auth.middleware';
import { JoseTokenService } from './infrastructure/adapters/jose-token.service';
import { MediaController } from './presentation/controllers/media.controller';
import { MediaService } from './application/media.service';
import { R2StorageService } from './infrastructure/adapters/R2-storage.service';
import { ENV } from '@config/env.loader';
import { authPolicy } from '@config/auth.policy';
import { mediaPolicy } from '@config/media.policy';
import { KnexMediaRepository } from './infrastructure/repositories/knex-media.repository';

const userRepository = new KnexUserRepository(db);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const hashService = new Argon2HashService();
const tokenService = new JoseTokenService(jwtConfig);
const authService = new AuthService(userRepository, hashService, tokenService, authPolicy);
const authController = new AuthController(authService);

const mediaRepository = new KnexMediaRepository(db);
const storageService = new R2StorageService(
  ENV.CLOUDFLARE_ACCOUNT_ID,
  ENV.CLOUDFLARE_ACCESS_KEY_ID,
  ENV.CLOUDFLARE_SECRET_ACCESS_KEY,
  ENV.CLOUDFLARE_BUCKET,
);
const mediaService = new MediaService(mediaRepository, storageService, mediaPolicy);
const mediaController = new MediaController(mediaService);

const jwtAuth = createJwtAuthMiddleware(tokenService);

export { userController, authController, mediaController, jwtAuth };
