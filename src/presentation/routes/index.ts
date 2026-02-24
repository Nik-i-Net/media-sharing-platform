import { Router } from 'express';
import { authRouter } from './auth.routes';
import { userRouter } from './users.routes';
import { mediaRouter } from './media.routes';

const router = Router();
router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/media', mediaRouter);

export { router };
