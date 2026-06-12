import { StatusCodes } from '@/shared/constants';
import { ConflictError, type OpenapiErrorResponse } from '@/shared/errors';
import { z } from 'zod';

export class EmailTakenError extends ConflictError {
  constructor() {
    super('Email already in use. Login to link accounts', 'EMAIL_TAKEN');
  }
}

export const EmailTakenErrorResponse = {
  [StatusCodes.CONFLICT]: {
    description: 'Email already taken',
    content: {
      'application/json': {
        schema: z.object({
          error: z.object({
            message: z.string().meta({ example: 'Email already taken' }),
            code: z.literal('EMAIL_TAKEN'),
          }),
        }),
      },
    },
  },
} satisfies OpenapiErrorResponse;
