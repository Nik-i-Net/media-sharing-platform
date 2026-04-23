import { BaseError, type ErrorResponse } from './base.error';
import { StatusCodes } from '../constants';
import { z } from 'zod';

export class UnauthorizedError extends BaseError {
  readonly httpStatusCode = StatusCodes.UNAUTHORIZED;

  constructor(message?: string) {
    super(message ?? 'Unauthorized', 'UNAUTHORIZED');
  }
}

export const UnauthorizedErrorResponse = {
  [StatusCodes.UNAUTHORIZED]: {
    description: 'Validation error',
    content: {
      'application/json': {
        schema: z.object({
          error: z.object({
            message: z.literal('Unauthorized'),
            code: z.literal('UNAUTHORIZED'),
          }),
        }),
      },
    },
  },
} satisfies ErrorResponse;
