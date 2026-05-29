import { z } from 'zod';
import { StatusCodes } from '../constants';
import { BaseError, type OpenapiErrorResponse } from './base.error';

export class BadRequestError extends BaseError {
  readonly httpStatusCode = StatusCodes.BAD_REQUEST;
  readonly cause?: unknown;

  constructor(message?: string, code?: string, opts?: { cause?: unknown }) {
    super(message ?? 'Bad request', code ?? 'BAD_REQUEST');
    if (opts?.cause) this.cause = opts.cause;
  }
}

export const BadRequestErrorResponse = {
  [StatusCodes.BAD_REQUEST]: {
    description: 'Bad request',
    content: {
      'application/json': {
        schema: z.object({
          error: z.object({
            message: z.string().meta({ example: 'Bad request' }),
            code: z.literal('BAD_REQUEST'),
          }),
        }),
      },
    },
  },
} satisfies OpenapiErrorResponse;
