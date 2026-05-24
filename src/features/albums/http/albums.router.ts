import { Router } from 'express';

const modules = await Promise.all([
  import('./POST'), //
  import('./GET'),
  import('./[id].GET'),
  import('./[id].PATCH'),
  import('./[id].DELETE'),
  import('./[id].uploads.POST'),
  import('./[id].uploads.GET'),
  import('./[id].uploads.DELETE'),
]);

export const albumsRouter = Router();

modules.forEach((module) => {
  module.registerRoute(albumsRouter);
});
