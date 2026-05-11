import { Router } from 'express';

const routes = await Promise.all([
  import('@/features/uploads/http/webhooks/cloudflare.r2.uploads.POST'), //
]);

export const webhooksRouter = Router();
routes.forEach((route) => {
  route.registerRoute(webhooksRouter);
});
