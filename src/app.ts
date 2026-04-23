import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import { unknownRouteHandler, errorHandler } from './shared/middlewares';
import cors from 'cors';
import { ENV } from './config/env.loader';
import { registerUsersRoutes, usersRouter } from './features/users/http/users.routes';
import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { openapiRegistry } from './config/openapi';
import swaggerUi from 'swagger-ui-express';

await Promise.all([
  registerUsersRoutes(), //
]);

const router = Router();
router.use('/users', usersRouter);

const generator = new OpenApiGeneratorV31(openapiRegistry.definitions);
export const openapiDocument = generator.generateDocument({
  openapi: '3.1.0',
  info: { title: 'Mediahub API', version: '1.0.0' },
});

export const app = express();
app.use(cors({ origin: ENV.CLIENT_BASE_URL }));
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));
app.use('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(openapiDocument);
});
app.use(unknownRouteHandler);
app.use(errorHandler);
