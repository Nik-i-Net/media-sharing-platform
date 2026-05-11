import { Router } from 'express';

const modules = await Promise.all([
  import('./signed-urls.POST'), //
]);

export const uploadsRouter = Router();

modules.forEach((module) => {
  module.registerRoute(uploadsRouter);
});
