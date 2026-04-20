import type { RequestHandler } from 'express-serve-static-core';
import { StatusCodes } from '../constants';
import { z } from 'zod';

const ErrorResponseSchema = z.object({
  error: z.object({
    code: z.literal('UNAUTHORIZED'),
    message: z.literal('Missing or invalid API key'),
  }),
});
const errorResponse: z.infer<typeof ErrorResponseSchema> = {
  error: {
    code: 'UNAUTHORIZED',
    message: 'Missing or invalid API key',
  },
};

export const OPENAPI_InvalidApiKeyResponse = {
  [StatusCodes.UNAUTHORIZED]: {
    description: 'Missing or invalid `x-api-key` header',
    content: { 'application/json': { schema: ErrorResponseSchema } },
  },
};

export function checkApiKey(apiKey: string): RequestHandler {
  return (req, res, next) => {
    if (req.headers['x-api-key'] !== apiKey) {
      res.status(StatusCodes.UNAUTHORIZED).json(errorResponse);
      return;
    }

    next();
  };
}
