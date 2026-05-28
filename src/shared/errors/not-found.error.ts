import { z } from 'zod';
import { StatusCodes } from '../constants';
import { BaseError, type OpenapiErrorResponse } from './base.error';

export class NotFoundError extends BaseError {
  readonly httpStatusCode = StatusCodes.NOT_FOUND;

  constructor(message: string, code: string) {
    super(message ?? 'Not found', code ?? 'NOT_FOUND');
  }
}

export const NotFoundErrorResponse = {
  [StatusCodes.NOT_FOUND]: {
    description: 'Payment profile not found',
    content: {
      'application/json': {
        schema: z.object({
          error: z.object({
            message: z.string().meta({ example: 'Not found' }),
            code: z.literal('NOT_FOUND'),
          }),
        }),
      },
    },
  },
} satisfies OpenapiErrorResponse;
