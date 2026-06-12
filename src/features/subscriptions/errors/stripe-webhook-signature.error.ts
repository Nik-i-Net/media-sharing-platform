import { BadRequestError } from '@/shared/errors';

export class StripeWebhookSignatureError extends BadRequestError {
  constructor(message?: string, opts?: { cause?: unknown }) {
    super(
      message ?? 'Invalid or missing Stripe webhook signature', //
      'STRIPE_WEBHOOK_SIGNATURE_ERROR',
      opts,
    );
  }
}
