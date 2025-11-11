import express, { Router } from 'express';
import { UsersModule } from './modules/users/users.module.js';
import { errorHandler } from './shared/middlewares/error-handler.middleware.js';
import { notFoundHandler } from './shared/middlewares/not-found.middleware.js';

const app = express();
const router = Router();

const modules = [
  new UsersModule('/users'), //
];

modules.forEach((module) => module.register(router));

app.use(express.json());
app.use('/api/v1', router);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
