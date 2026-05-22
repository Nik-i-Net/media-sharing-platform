import { Router } from 'express';

const modules = await Promise.all([
  import('./POST'), //
  import('./[id].GET'),
  import('./[id].DELETE'),
]);

export const albumsRouter = Router();

modules.forEach((module) => {
  module.registerRoute(albumsRouter);
});
