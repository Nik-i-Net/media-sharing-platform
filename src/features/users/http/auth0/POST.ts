import { z } from 'zod';
import type { Router } from 'express';
import { authCommandHandler } from '@/di';
import { ENV } from '@/config/env.loader';
import { checkApiKey, validateRequest } from '@/shared/middlewares';
import { openapiRegistry } from '@/config/openapi';

const RequestSchema = z.object({
  provider: z.enum(['auth0', 'google-oauth2']),
  providerUserId: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
});

const ResponseSchema = z.object({
  data: z.object({ userId: z.uuidv4() }),
});

const response500 = {
  description: 'Internal server error',
  content: {
    'application/json': {
      schema: z.object({
        error: z.object({
          code: z.literal('INTERNAL_SERVER_ERROR'),
          message: z.literal('Internal server error'),
        }),
      }),
    },
  },
};

openapiRegistry.registerPath({
  method: 'post',
  path: '/api/v1/users/auth0',
  description: 'Authenticate user with Auth0',
  summary: 'Auth0 authentication',
  request: {
    headers: z.object({ 'x-api-key': z.string() }),
    body: {
      description: 'User data',
      content: { 'application/json': { schema: RequestSchema } },
    },
  },
  responses: {
    200: {
      description: 'UserId',
      content: { 'application/json': { schema: ResponseSchema } },
    },
    500: response500,
  },
});

export function registerRoute(usersRouter: Router) {
  usersRouter.post(
    '/auth0',
    checkApiKey(ENV.AUTH0_API_KEY),
    validateRequest({ body: RequestSchema }),
    async (req, res) => {
      const userId = await authCommandHandler.execute(req.body);
      const response = ResponseSchema.parse({ data: { userId } });
      res.json(response);
    },
  );
}
