import db from './infrastructure/persistence/knex-client.js';
import { UserService } from './application/user.service.js';
import { KnexUserRepository } from './infrastructure/repositories/knex-user.repository.js';
import { UserController } from './presentation/controllers/user.controller.js';
import { Argon2HashService } from './infrastructure/adapters/argon2-hash.service.js';
import { JwtTokenService } from './infrastructure/adapters/jwt-token.service.js';
import { authPolicy, jwtConfig } from './@config/auth.config.js';
import { AuthService } from './application/auth.service.js';
import { AuthController } from './presentation/controllers/auth.controller.js';

const userRepository = new KnexUserRepository(db);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const hashService = new Argon2HashService();
const tokenService = new JwtTokenService(jwtConfig);
const authService = new AuthService(userRepository, hashService, tokenService, authPolicy);
const authController = new AuthController(authService);

export { userController, authController };
