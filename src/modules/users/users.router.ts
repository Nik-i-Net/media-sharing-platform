import { Router } from 'express';
import { usersController } from './users.controller.js';

const usersRouter = Router();

usersRouter.route('/').post(usersController.createUser);

usersRouter
  .route('/:id')
  .get(usersController.getUserById)
  .patch(usersController.updateUserInfo)
  .delete(usersController.deleteUser);

export { usersRouter };
