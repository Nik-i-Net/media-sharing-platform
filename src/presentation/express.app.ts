import express from 'express';
import { router } from './express.routes';
import { unknownRouteHandler } from './middlewares/unknown-route-handler.middleware';
import { errorHandler } from './middlewares/error-handler.middleware';

const app = express();
app.use(express.json());
app.use('/api/v1', router);
app.use(unknownRouteHandler);
app.use(errorHandler);

export { app };
