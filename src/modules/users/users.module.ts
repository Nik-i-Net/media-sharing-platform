import { Router } from 'express';
import { UsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import type { Module } from '@src/shared/types/module.types.js';

const usersRepository = new UsersRepository();
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

class UsersModule implements Module {
  constructor(readonly path: string) {}

  register(router: Router): void {
    const usersRouter = Router();

    usersRouter
      .route('/') //
      .get((req, res) => res.send('users'))
      .post(usersController.createUser);

    usersRouter
      .route('/:id')
      .get(usersController.getUserById)
      .patch(usersController.updateUserInfo)
      .delete(usersController.deleteUser);

    router.use(this.path, usersRouter);
  }
}

export { UsersModule, usersService };
