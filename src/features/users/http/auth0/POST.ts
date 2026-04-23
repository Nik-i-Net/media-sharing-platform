import { z } from 'zod';
import type { Response, Router } from 'express';
import { authCommandHandler } from '@/di';
import { ENV } from '@/config/env.loader';
import { checkApiKey, InvalidApiKeyResponse, validateRequest } from '@/shared/middlewares';
import { openapiRegistry } from '@/config/openapi';
import { InternalServerErrorResponse, ValidationErrorResponse } from '@/shared/errors';

export function registerRoute(usersRouter: Router) {
  const RequestSchema = z.object({
    provider: z.enum(['auth0', 'google-oauth2']),
    providerUserId: z.string(),
    email: z.email(),
    emailVerified: z.boolean(),
  });

  const ResponseSchema = z.object({
    data: z.object({ userId: z.uuidv4() }),
  });

  usersRouter.post(
    '/auth0',
    checkApiKey(ENV.AUTH0_API_KEY),
    validateRequest({ body: RequestSchema }),
    async (req, res: Response<z.infer<typeof ResponseSchema>>) => {
      const userId = await authCommandHandler.execute(req.body);
      const response = ResponseSchema.parse({ data: { userId } });
      res.json(response);
    },
  );

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
    tags: ['Auth0'],
    responses: {
      200: {
        description: 'Returns `userId`',
        content: { 'application/json': { schema: ResponseSchema } },
      },
      ...InvalidApiKeyResponse,
      ...ValidationErrorResponse,
      ...InternalServerErrorResponse,
    },
  });
}
