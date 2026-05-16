import type { RequestHandler } from 'express-serve-static-core';
import { StatusCodes } from '../constants';
import { z } from 'zod';
import { UnauthorizedError, type ErrorResponse } from '../errors';

export function checkApiKey(apiKey: string): RequestHandler {
  return (req, _res, next) => {
    if (req.headers['x-api-key'] !== apiKey) {
      throw new UnauthorizedError();
    }

    next();
  };
}

export const InvalidApiKeyResponse = {
  [StatusCodes.UNAUTHORIZED]: {
    description: 'Missing or invalid `x-api-key` header',
    content: {
      'application/json': {
        schema: z.object({
          error: z.object({
            message: z.literal('Missing or invalid API key'),
            code: z.literal('UNAUTHORIZED'),
          }),
        }),
      },
    },
  },
} satisfies ErrorResponse;
