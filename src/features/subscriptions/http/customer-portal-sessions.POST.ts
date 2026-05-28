import { createCustomerPortalUrl } from '@/app/di';
import {
  InternalServerErrorResponse,
  UnauthorizedErrorResponse,
  ValidationErrorResponse,
} from '@/shared/errors';
import { checkJwt, validateRequest } from '@/shared/middlewares';
import { openapiRegistry } from '@/shared/openapi-registry';
import { requireDefined } from '@/shared/utils';
import type { Response, Router } from 'express';
import { z } from 'zod';
import { PaymentProfileNotFoundErrorResponse } from '../errors/payment-profile-not-found.error';
import { StatusCodes } from '@/shared/constants';

export function registerRoute(subscriptionsRouter: Router) {
  subscriptionsRouter.post(
    '/customer-portal-sessions', //
    checkJwt(),
    validateRequest({ body: RequestBodySchema }),
    async (req, res: Response<z.infer<typeof ResponseSchema>>) => {
      const checkoutUrl = await createCustomerPortalUrl.execute({
        userId: requireDefined(req.user?.id),
        returnUrl: req.body.returnUrl,
      });
      const response = ResponseSchema.decode({ data: { url: checkoutUrl } });
      res.status(StatusCodes.CREATED).json(response);
    },
  );
}

const RequestBodySchema = z.object({
  // returnUrl: z.httpUrl().optional(),
  returnUrl: z.union([z.httpUrl(), z.string().startsWith('http://localhost')]).optional(),
});

const ResponseSchema = z
  .object({
    data: z.object({ url: z.httpUrl() }),
  })
  .brand<'Response'>();

openapiRegistry.registerPath({
  method: 'post',
  path: '/api/v1/subscriptions/customer-portal-sessions',
  summary: 'Create Customer Portal session',
  description: `
Create a Stripe Customer Portal session.
Providing optional \`returnUrl\` and \`cancelUrl\` will redirect the user to the provided URLs after the checkout session is completed.
`,
  request: {
    headers: z.object({
      Authorization: z.templateLiteral(['Bearer ', z.jwt()]).meta({ description: 'Bearer `JWT`' }),
    }),
    body: {
      description: 'Optional return URL',
      content: { 'application/json': { schema: RequestBodySchema } },
    },
  },
  tags: ['Subscriptions', 'Stripe'],
  responses: {
    [StatusCodes.CREATED]: {
      description: 'Stripe Customer Portal session URL',
      content: { 'application/json': { schema: ResponseSchema } },
    },
    ...UnauthorizedErrorResponse,
    ...PaymentProfileNotFoundErrorResponse,
    ...ValidationErrorResponse,
    ...InternalServerErrorResponse,
  },
});
