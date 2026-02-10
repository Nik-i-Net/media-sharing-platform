import { Router } from 'express';
import { validateRequest } from '../middlewares/validate-request.middleware';
import { authController } from '../../composition-root';
import { RegisterDto, LoginDto, UpdatePasswordDto } from '../../application/dto';

const authRouter = Router();

authRouter.post(
  '/register', //
  validateRequest({ body: RegisterDto }),
  authController.register,
);

authRouter.post(
  '/login', //
  validateRequest({ body: LoginDto }),
  authController.login,
);

authRouter.post(
  '/refresh', //
  authController.refresh,
);

authRouter.patch(
  '/password', //
  validateRequest({ body: UpdatePasswordDto }),
  authController.updatePassword,
);

export { authRouter };
