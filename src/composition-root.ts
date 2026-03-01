import db from './infrastructure/persistence/knex-client';
import { UserService } from './application/user.service';
import { KnexUserRepository } from './infrastructure/repositories/knex-user.repository';
import { UserController } from './presentation/controllers/user.controller';
import { Argon2HashService } from './infrastructure/adapters/argon2-hash.service';
import { authPolicy, jwtConfig } from './@config/auth.config';
import { AuthService } from './application/auth.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { createJwtAuthMiddleware } from './presentation/middlewares/jwt-auth.middleware';
import { JoseTokenService } from './infrastructure/adapters/jose-token.service';
import { MediaController } from './presentation/controllers/media.controller';
import { MediaService } from './application/media.service';

const userRepository = new KnexUserRepository(db);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const hashService = new Argon2HashService();
const tokenService = new JoseTokenService(jwtConfig);
const authService = new AuthService(userRepository, hashService, tokenService, authPolicy);
const authController = new AuthController(authService);

const mediaService = new MediaService();
const mediaController = new MediaController(mediaService);

const jwtAuth = createJwtAuthMiddleware(tokenService);

export { userController, authController, mediaController, jwtAuth };
