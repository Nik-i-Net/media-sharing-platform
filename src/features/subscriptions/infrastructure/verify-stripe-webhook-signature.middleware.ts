import { stripeClient } from '@/app/di';
import { StatusCodes } from '@/shared/constants';
import { ENV } from '@/shared/env.loader';
import type { OpenapiErrorResponse } from '@/shared/errors';
import type { RequestHandler } from 'express';
import { z } from 'zod';
import { StripeWebhookSignatureError } from '../errors/stripe-webhook-signature.error';

export function verifyStripeWebhookSignature(): RequestHandler {
  return (req, _res, next) => {
    const signature = req.headers['stripe-signature'];
    if (!signature) throw new StripeWebhookSignatureError('Missing signature');

    try {
      stripeClient.webhooks.constructEvent(req.rawBody!, signature, ENV.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      throw new StripeWebhookSignatureError('Invalid signature', { cause: err });
    }

    next();
  };
}

export const InvalidStripeWebhookSignatureResponse = {
  [StatusCodes.BAD_REQUEST]: {
    description: 'Missing or invalid `stripe-signature` header',
    content: {
      'application/json': {
        schema: z.object({
          error: z.object({
            message: z.string().meta({ example: 'Missing or invalid Stripe webhook signature' }),
            code: z.literal('STRIPE_WEBHOOK_SIGNATURE_ERROR'),
          }),
        }),
      },
    },
  },
} satisfies OpenapiErrorResponse;

declare module 'express-serve-static-core' {
  interface Request {
    rawBody?: Buffer;
  }
}
