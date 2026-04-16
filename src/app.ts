import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import { unknownRouteHandler, errorHandler } from './shared/middlewares';
import cors from 'cors';
import { ENV } from '@config/env.loader';
import { usersRouter } from '@features/users/users.routes';

const router = Router();
router.use('/users', usersRouter);

export const app = express();
app.use(cors({ origin: ENV.CLIENT_BASE_URL }));
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1', router);
app.use(unknownRouteHandler);
app.use(errorHandler);
