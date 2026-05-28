import { Router } from 'express';

const modules = await Promise.all([
]);

export const subscriptionsRouter = Router();

modules.forEach((module) => {
  module.registerRoute(subscriptionsRouter);
});
