import { Router } from 'express';
import { usersRouter } from './modules/users/users.router.js';

const router = Router();

router.use('/users', usersRouter);

export { router };
