import { Router } from 'express';
import { AuthService } from './auth.service.js';
import { usersService } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import type { Module } from '@src/shared/types/module.types.js';

const authService = new AuthService(usersService);
const authController = new AuthController(authService);

class AuthModule implements Module {
  constructor(readonly path: string) {}

  register(router: Router): void {
    const authRouter = Router();

    authRouter.post('/register', authController.register);
    authRouter.post('/login', authController.register);
    authRouter.post('/logout', authController.register);

    router.use(this.path, authRouter);
  }
}

export { AuthModule };
