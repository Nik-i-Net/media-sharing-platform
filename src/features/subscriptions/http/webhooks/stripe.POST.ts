import { ENV } from '@/shared/env.loader';
import { InternalServerErrorResponse, ValidationErrorResponse } from '@/shared/errors';
import { validateRequest } from '@/shared/middlewares';
import { openapiRegistry } from '@/shared/openapi-registry';
import type { Router } from 'express';
import { z } from 'zod';
import {
  InvalidStripeWebhookSignatureResponse,
  verifyStripeWebhookSignature,
} from '../../infrastructure/verify-stripe-webhook-signature.middleware';
import {
  handleSubscriptionCanceled,
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
} from '@/app/di';
import type { HandleSubscriptionCreatedCommand } from '../../application/handle-subscription-created.command';
import { requireDefined } from '@/shared/utils';
import type { HandleSubscriptionUpdatedCommand } from '../../application/handle-subscription-updated.command';

export function registerRoute(webhooksRouter: Router) {
  webhooksRouter.post(
    '/stripe', //
    verifyStripeWebhookSignature(),
    validateRequest({ body: RequestBodySchema }),
    async (req, res) => {
      const event = req.body.type;
      const subscriptionId = req.body.data.object.id;

      switch (event) {
        case 'customer.subscription.created': {
          const cmd: HandleSubscriptionCreatedCommand = {
            userId: req.body.data.object.metadata.userId,
            planId: req.body.data.object.metadata.planId,
            customerId: req.body.data.object.customer,
            subscriptionId,
            createdAt: requireDefined(req.body.data.object.items.data[0]?.current_period_start),
            expiresAt: requireDefined(req.body.data.object.items.data[0]?.current_period_end),
          };
          await handleSubscriptionCreated.execute(cmd);
          break;
        }

        case 'customer.subscription.updated': {
          if (req.body.data.object.status === 'past_due') {
            return res.sendStatus(204);
          }

          const cmd: HandleSubscriptionUpdatedCommand = {
            subscriptionId,
            expiresAt: requireDefined(req.body.data.object.items.data[0]?.current_period_end),
          };
          await handleSubscriptionUpdated.execute(cmd);
          break;
        }

        case 'customer.subscription.deleted': {
          await handleSubscriptionCanceled.execute(subscriptionId);
          break;
        }

        default:
          throw new Error(`Unexpected Stripe webhook event type: ${event satisfies never}`);
      }

      res.sendStatus(204);
    },
  );
}

const SubscriptionCreatedSchema = z.object({
  id: z.string().startsWith('evt_'),
  type: z.literal('customer.subscription.created'),
  request: z.object({ idempotency_key: z.string().nullable() }),
  data: z.object({
    object: z.object({
      id: z.string().startsWith('sub_'),
      object: z.literal('subscription'),
      customer: z.string().startsWith('cus_'),
      status: z.literal('active'),
      metadata: z.object({
        userId: z.uuid(),
        planId: z.literal('pro'),
      }),
      items: z.object({
        object: z.literal('list'),
        data: z
          .array(
            z.object({
              object: z.literal('subscription_item'),
              current_period_end: z
                .number()
                .int()
                .positive()
                .transform((value) => new Date(value * 1000)),
              current_period_start: z
                .number()
                .int()
                .positive()
                .transform((value) => new Date(value * 1000)),
              price: z.object({
                id: z.literal(ENV.STRIPE_PRO_PLAN_PRICE_ID),
                active: z.literal(true),
              }),
            }),
          )
          .nonempty(),
      }),
    }),
  }),
});

// NOTE: currently only handles renewals (current_period_end)
const SubscriptionUpdatedSchema = z.object({
  id: z.string().startsWith('evt_'),
  type: z.literal('customer.subscription.updated'),
  request: z.object({ idempotency_key: z.string().nullable() }),
  data: z.object({
    object: z.object({
      id: z.string().startsWith('sub_'),
      object: z.literal('subscription'),
      customer: z.string().startsWith('cus_'),
      status: z.literal(['active', 'past_due']),
      items: z.object({
        object: z.literal('list'),
        data: z
          .array(
            z.object({
              object: z.literal('subscription_item'),
              current_period_end: z
                .number()
                .int()
                .positive()
                .transform((value) => new Date(value * 1000)),
            }),
          )
          .nonempty(),
      }),
    }),
  }),
});

const SubscriptionDeletedSchema = z.object({
  id: z.string().startsWith('evt_'),
  type: z.literal('customer.subscription.deleted'),
  request: z.object({ idempotency_key: z.string().nullable() }),
  data: z.object({
    object: z.object({
      id: z.string().startsWith('sub_'),
      object: z.literal('subscription'),
      customer: z.string().startsWith('cus_'),
      status: z.literal('canceled'),
    }),
  }),
});

const RequestBodySchema = z.discriminatedUnion('type', [
  SubscriptionCreatedSchema,
  SubscriptionUpdatedSchema,
  SubscriptionDeletedSchema,
]);

openapiRegistry.registerPath({
  method: 'post',
  path: '/api/v1/webhooks/stripe',
  summary: 'Webhook for Stripe',
  description: `
Triggered by Cloudflare worker on events:
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
`,
  request: {
    headers: z.object({
      ['stripe-signature']: z.union([z.string(), z.array(z.string())]),
    }),
    body: {
      content: {
        'application/json': {
          schema: RequestBodySchema,
        },
      },
    },
  },
  tags: ['Subscriptions', 'Stripe', 'Webhooks'],
  responses: {
    204: { description: 'OK' },
    ...InvalidStripeWebhookSignatureResponse,
    ...ValidationErrorResponse,
    ...InternalServerErrorResponse,
  },
});
