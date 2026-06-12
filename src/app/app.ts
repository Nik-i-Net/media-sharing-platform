import { albumsRouter } from '@/features/albums/http/albums.router';
import { subscriptionsRouter } from '@/features/subscriptions/http/subscriptions.router';
import { uploadsRouter } from '@/features/uploads/http/uploads.router';
import { usersRouter } from '@/features/users/http/users.router';
import { ENV } from '@/shared/env.loader';
import { errorHandler, parseJwt, ratelimit, unknownRouteHandler } from '@/shared/middlewares';
import { openapiRegistry } from '@/shared/openapi-registry';
import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Router, type Request } from 'express';
import swaggerUi from 'swagger-ui-express';
import { webhooksRouter } from './webhooks.router';

const router = Router();
router.use('/users', usersRouter);
router.use('/uploads', uploadsRouter);
router.use('/albums', albumsRouter);
router.use('/subscriptions', subscriptionsRouter);
router.use('/webhooks', webhooksRouter);

const generator = new OpenApiGeneratorV31(openapiRegistry.definitions);
export const openapiDocument = generator.generateDocument({
  openapi: '3.1.0',
  info: { title: 'Mediahub API', version: '1.0.0' },
});

export const app = express();
app.use(cors({ origin: ENV.CLIENT_BASE_URL }));
app.use(
  express.json({
    verify: (req: Request, _res, buf) => {
      if (req.originalUrl === '/api/v1/webhooks/stripe') {
        req.rawBody = buf;
      }
    },
  }),
);
app.use(cookieParser());
app.use(parseJwt);
if (ENV.NODE_ENV !== 'test') {
  app.use(
    '/api/v1',
    ratelimit({
      scope: 'global',
      windowSec: 60,
      limit: 10, // NOTE: test value
      guestLimit: 5, // NOTE: test value
    }),
  );
}

app.use('/api/v1', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));
app.use('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(openapiDocument);
});

app.use(unknownRouteHandler);
app.use(errorHandler);
