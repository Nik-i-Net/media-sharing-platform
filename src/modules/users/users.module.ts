import { Router } from 'express';
import { UsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import db from '@core/database/knex-client.js';

const usersRepository = new UsersRepository(db);
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);
const usersRouter = Router();

usersRouter
  .route('/:id')
  .get(usersController.getUserById)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

export { usersRouter, usersService };
