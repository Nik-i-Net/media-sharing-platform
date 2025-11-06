import express, { Router } from 'express';
import { UsersModule } from './modules/users/users.module.js';

const app = express();
const router = Router();

const modules = [
  new UsersModule('/users'), //
];

modules.forEach((module) => module.register(router));

app.use(express.json());
app.use('/api/v1', router);

export { app };
