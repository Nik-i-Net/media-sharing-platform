import { Router } from 'express';
import { AuthService } from './auth.service.js';
import { usersService } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';

const authService = new AuthService(usersService);
const authController = new AuthController(authService);
const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/logout', authController.logout);

export { authRouter };
