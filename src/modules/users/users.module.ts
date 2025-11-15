import { Router } from 'express';
import { UsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';

const usersRepository = new UsersRepository();
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);
const usersRouter = Router();

usersRouter
  .route('/') //
  .post(usersController.createUser);

usersRouter
  .route('/:id')
  .get(usersController.getUserById)
  .patch(usersController.updateUserInfo)
  .delete(usersController.deleteUser);

export { usersRouter, usersService };
