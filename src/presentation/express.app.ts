import express from 'express';
import { router } from './express.routes.js';
import { unknownRouteHandler } from './middlewares/unknown-route-handler.middleware.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';

const app = express();
app.use(express.json());
app.use('/api/v1', router);
app.use(unknownRouteHandler);
app.use(errorHandler);

export { app };
