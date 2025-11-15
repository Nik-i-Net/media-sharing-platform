import express, { Router } from 'express';
import { usersRouter } from './modules/users/users.module.js';
import { errorHandler } from './shared/middlewares/error-handler.middleware.js';
import { notFoundHandler } from './shared/middlewares/not-found.middleware.js';
import { authRouter } from './modules/auth/auth.module.js';

const app = express();
const router = Router();

router.use('/users', usersRouter);
router.use('/auth', authRouter);

app.use(express.json());
app.use('/api/v1', router);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
