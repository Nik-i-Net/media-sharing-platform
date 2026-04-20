import { Router } from 'express';

export const usersRouter = Router();

export async function registerUsersRoutes() {
  const modules = await Promise.all([
    import('./auth0/POST'), //
  ]);

  modules.forEach((module) => {
    module.registerRoute(usersRouter);
  });
}
