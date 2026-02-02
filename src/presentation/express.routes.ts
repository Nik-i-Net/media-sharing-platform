import { Router } from 'express';
import { validateRequest } from './middlewares/validate-request.middleware';
import { authController, userController } from '../composition-root';
import { LoginDto, RefreshTokenDto, RegisterDto, UpdatePasswordDto } from '../application/dto';

const userRouter = Router();
userRouter
  .route('/me') //
  .get(userController.getMe)
  .post(userController.updateMe)
  .delete(userController.deleteMe);

const authRouter = Router();
authRouter.post('/register', validateRequest({ body: RegisterDto }), authController.register);
authRouter.post('/login', validateRequest({ body: LoginDto }), authController.login);
authRouter.post('/refresh', validateRequest({ body: RefreshTokenDto }), authController.refresh);
authRouter.patch('/password', validateRequest({ body: UpdatePasswordDto }), authController.updatePassword);

const router = Router();
router.use('/users', userRouter);
router.use('/auth', authRouter);

export { router };
