import { StatusCodes } from '@/shared/constants';
import { ConflictError, type OpenapiErrorResponse } from '@/shared/errors';
import { z } from 'zod';

export class ActiveSubscriptionExistsError extends ConflictError {
  constructor() {
    super('User already has an active subscription', 'ACTIVE_SUBSCRIPTION_EXISTS');
  }
}

export const ActiveSubscriptionExistsErrorResponse = {
  [StatusCodes.CONFLICT]: {
    description: 'User already has an active subscription',
    content: {
      'application/json': {
        schema: z.object({
          error: z.object({
            message: z.string().meta({ example: 'User already has an active subscription' }),
            code: z.literal('ACTIVE_SUBSCRIPTION_EXISTS'),
          }),
        }),
      },
    },
  },
} satisfies OpenapiErrorResponse;
