import { StatusCodes } from '@shared/constants';
import type { RequestHandler } from 'express-serve-static-core';

export function checkApiKey(apiKey: string): RequestHandler {
  return (req, res, next) => {
    if (req.headers['x-api-key'] !== apiKey) {
      res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' });
      return;
    }

    next();
  };
}
