import { Router } from 'express';

const modules = await Promise.all([
  import('./POST'), //
  import('./[id].GET'),
]);

export const uploadsRouter = Router();

modules.forEach((module) => {
  module.registerRoute(uploadsRouter);
});
