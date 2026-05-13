import { Router } from 'express';

const modules = await Promise.all([
  import('./presign.POST'), //
]);

export const uploadsRouter = Router();

modules.forEach((module) => {
  module.registerRoute(uploadsRouter);
});
