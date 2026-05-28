import { StatusCodes } from '@/shared/constants';
import { NotFoundError, type OpenapiErrorResponse } from '@/shared/errors';
import { z } from 'zod';

export class PaymentProfileNotFoundError extends NotFoundError {
  constructor() {
    super('Payment profile not found', 'PAYMENT_PROFILE_NOT_FOUND');
  }
}

export const PaymentProfileNotFoundErrorResponse = {
  [StatusCodes.NOT_FOUND]: {
    description: 'Payment profile not found',
    content: {
      'application/json': {
        schema: z.object({
          error: z.object({
            message: z.string().meta({ example: 'Payment profile not found' }),
            code: z.literal('PAYMENT_PROFILE_NOT_FOUND'),
          }),
        }),
      },
    },
  },
} satisfies OpenapiErrorResponse;
