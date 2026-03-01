import { Router } from 'express';
import { validateRequest } from '../middlewares/validate-request.middleware';
import { authController } from '../../composition-root';
import { RegisterRequest, LoginRequest, UpdatePasswordRequest } from '../../application/dto';

const authRouter = Router();

authRouter.post(
  '/register', //
  validateRequest({ body: RegisterRequest }),
  authController.register,
);

authRouter.post(
  '/login', //
  validateRequest({ body: LoginRequest }),
  authController.login,
);

authRouter.post(
  '/refresh', //
  authController.refresh,
);

authRouter.patch(
  '/password', //
  validateRequest({ body: UpdatePasswordRequest }),
  authController.updatePassword,
);

export { authRouter };
