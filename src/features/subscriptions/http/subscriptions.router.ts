import { Router } from 'express';

const modules = await Promise.all([
  import('./checkout-sessions.POST'), //
  import('./customer-portal-sessions.POST'),
]);

export const subscriptionsRouter = Router();

modules.forEach((module) => {
  module.registerRoute(subscriptionsRouter);
});
