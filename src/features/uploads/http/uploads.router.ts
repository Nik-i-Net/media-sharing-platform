import { Router } from 'express';

const modules = await Promise.all([
  import('./POST'), //
  import('./GET'),
  import('./[id].GET'),
  // import('./[id].PATCH'), // TODO: implement
  // import('./[id].DELETE'), // TODO: implement
]);

export const uploadsRouter = Router();

modules.forEach((module) => {
  module.registerRoute(uploadsRouter);
});
