import { BaseError, type OpenapiErrorResponse } from './base.error';
import { StatusCodes } from '../constants';
import { z } from 'zod';

export class UnauthorizedError extends BaseError {
  readonly httpStatusCode = StatusCodes.UNAUTHORIZED;

  constructor() {
    super('Unauthorized', 'UNAUTHORIZED');
  }
}

export const UnauthorizedErrorResponse = {
  [StatusCodes.UNAUTHORIZED]: {
    description: 'Authorization required',
    content: {
      'application/json': {
        schema: z.object({
          error: z.object({
            message: z.string().meta({ example: 'Unauthorized' }),
            code: z.literal('UNAUTHORIZED'),
          }),
        }),
      },
    },
  },
} satisfies OpenapiErrorResponse;
