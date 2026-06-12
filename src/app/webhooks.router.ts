import { Router } from 'express';

const routes = await Promise.all([
  import('@/features/uploads/http/webhooks/cloudflare.POST'), //
  import('@/features/subscriptions/http/webhooks/stripe.POST'),
]);

export const webhooksRouter = Router();
routes.forEach((route) => {
  route.registerRoute(webhooksRouter);
});
