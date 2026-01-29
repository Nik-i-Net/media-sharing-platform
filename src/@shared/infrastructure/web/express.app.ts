import express, { Router } from 'express';
import { userRouter } from 'src/users/user.module.js';
import { authRouter } from 'src/auth/auth.module.js';
import { notFoundHandler } from './middlewares/not-found.middleware.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';

const router = Router();
router.use('/users', userRouter);
router.use('/auth', authRouter);

const app = express();
app.use(express.json());
app.use('/api/v1', router);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
