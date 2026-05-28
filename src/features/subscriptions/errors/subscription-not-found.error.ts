import { StatusCodes } from '@/shared/constants';
import { NotFoundError, type OpenapiErrorResponse } from '@/shared/errors';
import { z } from 'zod';

export class SubscriptionNotFoundError extends NotFoundError {
  constructor() {
    super('Subscription not found', 'SUBSCRIPTION_NOT_FOUND');
  }
}

export const SubscriptionNotFoundErrorResponse = {
  [StatusCodes.NOT_FOUND]: {
    description: 'Subscription not found',
    content: {
      'application/json': {
        schema: z.object({
          error: z.object({
            message: z.string().meta({ example: 'Subscription not found' }),
            code: z.literal('SUBSCRIPTION_NOT_FOUND'),
          }),
        }),
      },
    },
  },
} satisfies OpenapiErrorResponse;
