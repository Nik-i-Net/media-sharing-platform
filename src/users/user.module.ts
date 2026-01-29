import { Router } from 'express';
import { KnexUserRepository } from './user.repository.js';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import db from '@shared/infrastructure/persistence/knex-client.js';

const userRepository = new KnexUserRepository(db);
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const userRouter = Router();

userRouter
  .route('/me') //
  .get(userController.getMe)
  .post(userController.updateMe)
  .delete(userController.deleteMe);

export { userRouter, userRepository };
