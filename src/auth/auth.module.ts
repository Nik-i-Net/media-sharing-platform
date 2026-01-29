import { Router } from 'express';
import { AuthService } from './services/auth.service.js';
import { Argon2HashService } from './services/hash.service.js';
import { JwtService } from './services/token.service.js';
import { AuthController } from './auth.controller.js';
import { authPolicy, jwtConfig } from '@config/auth.config.js';
import { userRepository } from '../users/user.module.js';

const hashService = new Argon2HashService();
const tokenService = new JwtService(jwtConfig);
const authService = new AuthService(userRepository, hashService, tokenService, authPolicy);
const authController = new AuthController(authService);
const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/refresh', authController.refresh);
authRouter.patch('/password', authController.updatePassword);

export { authRouter };
