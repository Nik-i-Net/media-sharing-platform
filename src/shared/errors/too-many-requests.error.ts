import { z } from 'zod';
import { StatusCodes } from '../constants';
import { BaseError, type OpenapiErrorResponse } from './base.error';

export class TooManyRequestsError extends BaseError {
  readonly httpStatusCode = StatusCodes.TOO_MANY_REQUESTS;

  constructor() {
    super('Too many requests', 'TOO_MANY_REQUESTS');
  }
}

export const TooManyRequestsErrorResponse = {
  [StatusCodes.TOO_MANY_REQUESTS]: {
    description: 'Too many requests',
    content: {
      'application/json': {
        schema: z.object({
          error: z.object({
            message: z.string().meta({ example: 'Too many requests' }),
            code: z.literal('TOO_MANY_REQUESTS'),
          }),
        }),
      },
    },
  },
} satisfies OpenapiErrorResponse;
