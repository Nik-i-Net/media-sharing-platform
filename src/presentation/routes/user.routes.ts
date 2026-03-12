import { Router } from 'express';
import { userController } from '../../composition-root';

const userRouter = Router();
userRouter
  .route('/me') //
  .get(userController.getMe)
  .post(userController.updateMe)
  .delete(userController.deleteMe);

export { userRouter };
