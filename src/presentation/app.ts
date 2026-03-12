import express from 'express';
import { router } from './routes';
import { unknownRouteHandler } from './middlewares/unknown-route-handler.middleware';
import { errorHandler } from './middlewares/error-handler.middleware';
import cookieParser from 'cookie-parser';

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1', router);
app.use(unknownRouteHandler);
app.use(errorHandler);

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      roles: string[];
    };
  }
}
