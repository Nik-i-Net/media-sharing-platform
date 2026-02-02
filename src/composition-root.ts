import db from './infrastructure/persistence/knex-client';
import { UserService } from './application/user.service';
import { KnexUserRepository } from './infrastructure/repositories/knex-user.repository';
import { UserController } from './presentation/controllers/user.controller';
import { Argon2HashService } from './infrastructure/adapters/argon2-hash.service';
import { JwtTokenService } from './infrastructure/adapters/jwt-token.service';
import { authPolicy, jwtConfig } from './@config/auth.config';
import { AuthService } from './application/auth.service';
import { AuthController } from './presentation/controllers/auth.controller';

const userRepository = new KnexUserRepository(db);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const hashService = new Argon2HashService();
const tokenService = new JwtTokenService(jwtConfig);
const authService = new AuthService(userRepository, hashService, tokenService, authPolicy);
const authController = new AuthController(authService);

export { userController, authController };
