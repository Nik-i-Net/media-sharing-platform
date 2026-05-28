import { z } from 'zod';
import { StatusCodes } from '../constants';
import { BaseError, type OpenapiErrorResponse } from './base.error';

export class ConflictError extends BaseError {
  readonly httpStatusCode = StatusCodes.CONFLICT;

  constructor(message: string, code: string) {
    super(message ?? 'Conflict', code ?? 'CONFLICT');
  }
}

export const ConflictErrorResponse = {
  [StatusCodes.CONFLICT]: {
    description: 'Conflict',
    content: {
      'application/json': {
        schema: z.object({
          error: z.object({
            message: z.string().meta({ example: 'Conflict' }),
            code: z.literal('CONFLICT'),
          }),
        }),
      },
    },
  },
} satisfies OpenapiErrorResponse;
