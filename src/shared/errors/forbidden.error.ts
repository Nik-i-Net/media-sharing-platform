import { BaseError, type OpenapiErrorResponse } from './base.error';
import { StatusCodes } from '../constants';
import { z } from 'zod';

export class ForbiddenError extends BaseError {
  readonly httpStatusCode = StatusCodes.FORBIDDEN;

  constructor(message?: string, code?: string) {
    super(message ?? 'Access forbidden', code ?? 'FORBIDDEN');
  }
}

export const ForbiddenErrorResponse = {
  [StatusCodes.FORBIDDEN]: {
    description: 'Access forbidden',
    content: {
      'application/json': {
        schema: z.object({
          error: z.object({
            message: z.literal('Access forbidden'),
            code: z.literal('FORBIDDEN'),
          }),
        }),
      },
    },
  },
} satisfies OpenapiErrorResponse;
