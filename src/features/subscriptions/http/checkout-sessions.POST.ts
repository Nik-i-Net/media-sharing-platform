import { createSubscriptionCheckoutUrl } from '@/app/di';
import { StatusCodes } from '@/shared/constants';
import {
  InternalServerErrorResponse,
  UnauthorizedErrorResponse,
  ValidationErrorResponse,
} from '@/shared/errors';
import { requireAuth, validateRequest } from '@/shared/middlewares';
import { openapiRegistry } from '@/shared/openapi-registry';
import { requireDefined } from '@/shared/utils';
import type { Response, Router } from 'express';
import { z } from 'zod';
import { ActiveSubscriptionExistsErrorResponse } from '../errors/active-subscription-exists.error';

export function registerRoute(subscriptionsRouter: Router) {
  subscriptionsRouter.post(
    '/checkout-sessions', //
    requireAuth,
    validateRequest({ body: RequestBodySchema }),
    async (req, res: Response<z.infer<typeof ResponseSchema>>) => {
      const checkoutUrl = await createSubscriptionCheckoutUrl.execute({
        userId: requireDefined(req.user?.id),
        successUrl: req.body.successUrl,
        cancelUrl: req.body.cancelUrl,
      });
      const response = ResponseSchema.decode({ data: { url: checkoutUrl } });
      res.status(StatusCodes.CREATED).json(response);
    },
  );
}

const urlSchema = z.union([z.httpUrl(), z.string().startsWith('http://localhost')]);

// NOTE: test values
const RequestBodySchema = z.object({
  successUrl: urlSchema,
  cancelUrl: urlSchema,
  // successUrl: z.httpUrl(),
  // cancelUrl: z.httpUrl(),
});

const ResponseSchema = z
  .object({
    data: z.object({ url: z.httpUrl() }),
  })
  .brand<'Response'>();

openapiRegistry.registerPath({
  method: 'post',
  path: '/api/v1/subscriptions/checkout-sessions',
  summary: 'Create Checkout session',
  description: `
Create a Stripe subscription Checkout session.  
Providing optional \`successUrl\` and \`cancelUrl\` will redirect the user to the provided URLs after the checkout session is completed.
`,
  request: {
    headers: z.object({
      Authorization: z.templateLiteral(['Bearer ', z.jwt()]).meta({ description: 'Bearer `JWT`' }),
    }),
    body: {
      description: 'Optional redirect URLs',
      content: { 'application/json': { schema: RequestBodySchema } },
    },
  },
  tags: ['Subscriptions', 'Stripe'],
  responses: {
    [StatusCodes.CREATED]: {
      description: 'Stripe Checkout session URL',
      content: { 'application/json': { schema: ResponseSchema } },
    },
    ...UnauthorizedErrorResponse,
    ...ActiveSubscriptionExistsErrorResponse,
    ...ValidationErrorResponse,
    ...InternalServerErrorResponse,
  },
});
