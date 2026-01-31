import { Router } from 'express';
import { AuthService } from './services/auth.service.js';
import { Argon2HashService } from './services/hash.service.js';
import { JwtService } from './services/token.service.js';
import { AuthController } from './auth.controller.js';
import { authPolicy, jwtConfig } from '@config/auth.config.js';
import { userRepository } from '../users/user.module.js';
import { validateRequest } from '@shared/infrastructure/web/middlewares/validate-request.middleware.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/tokens.dto.js';
import { UpdatePasswordDto } from './dto/update-password.dto.js';

const hashService = new Argon2HashService();
const tokenService = new JwtService(jwtConfig);
const authService = new AuthService(userRepository, hashService, tokenService, authPolicy);
const authController = new AuthController(authService);
const authRouter = Router();

authRouter.post('/register', validateRequest({ body: RegisterDto }), authController.register);
authRouter.post('/login', validateRequest({ body: LoginDto }), authController.login);
authRouter.post('/refresh', validateRequest({ body: RefreshTokenDto }), authController.refresh);
authRouter.patch('/password', validateRequest({ body: UpdatePasswordDto }), authController.updatePassword);

export { authRouter };
