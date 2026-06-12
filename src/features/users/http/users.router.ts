import { Router } from 'express';

const routes = await Promise.all([
  import('./auth0.POST'), //
]);

export const usersRouter = Router();
routes.forEach((route) => {
  route.registerRoute(usersRouter);
});
