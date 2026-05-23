import { z } from 'zod';
import type { Response, Router } from 'express';
import { checkApiKey, InvalidApiKeyResponse, validateRequest } from '@/shared/middlewares';
import { InternalServerErrorResponse, ValidationErrorResponse } from '@/shared/errors';
import { openapiRegistry } from '@/shared/openapi-registry';
import { requireNotEmpty } from '@/shared/utils';
import type { ResolveUserIdCommand } from '../application/resolve-user-id';
import { ENV } from '@/shared/env.loader';
import { resolveUserId } from '@/app/di';

export function registerRoute(usersRouter: Router) {
  usersRouter.post(
    '/auth0',
    checkApiKey(ENV.AUTH0_API_KEY),
    validateRequest({ body: RequestBodySchema }),
    async (req, res: Response<z.infer<typeof ResponseSchema>>) => {
      const cmd: ResolveUserIdCommand = {
        externalId: req.body.userId,
        email: req.body.email ?? null,
        emailVerified: req.body.emailVerified,
        identities: requireNotEmpty(req.body.identities),
      };
      const userId = await resolveUserId.execute(cmd);
      const response = ResponseSchema.decode({ data: { userId } });
      res.json(response);
    },
  );
}

const RequestBodySchema = z.object({
  userId: z.string(),
  email: z.email().optional(),
  emailVerified: z.boolean(),
  identities: z
    .array(
      z.object({
        provider: z.enum(['auth0', 'google-oauth2']),
        userId: z.string(),
      }),
    )
    .nonempty(),
});

const ResponseSchema = z
  .object({
    data: z.object({ userId: z.uuidv4() }),
  })
  .brand<'Response'>();

openapiRegistry.registerPath({
  method: 'post',
  path: '/api/v1/users/auth0',
  summary: 'Auth0 authentication',
  description: `
An endpoint designed for Auth0 Post-Login Actions.

- resolves internal \`userId\` based on provided user info;
- synchronizes linked \`identities\` (accounts) for existing users;
- either registers new users or blocks registration (returns an error) based on \`email\` availability.

**Note:** Returned \`userId\` should be included in JWT in order to identify the user.
`,
  request: {
    headers: z.object({ 'X-Api-Key': z.string() }),
    body: {
      description: 'User data',
      content: { 'application/json': { schema: RequestBodySchema } },
    },
  },
  tags: ['Auth0', 'Integrations'],
  responses: {
    200: {
      description: 'Returns `userId`',
      content: { 'application/json': { schema: ResponseSchema } },
    },
    // TODO: list all errors
    ...InvalidApiKeyResponse,
    ...ValidationErrorResponse,
    ...InternalServerErrorResponse,
  },
});
