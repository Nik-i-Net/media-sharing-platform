import { confirmUploads } from '@/app/di';
import { StatusCodes } from '@/shared/constants';
import { ENV } from '@/shared/env.loader';
import { InternalServerErrorResponse, ValidationErrorResponse } from '@/shared/errors';
import { checkApiKey, InvalidApiKeyResponse, validateRequest } from '@/shared/middlewares';
import { openapiRegistry } from '@/shared/openapi-registry';
import type { Router } from 'express';
import { z } from 'zod';

export function registerRoute(webhooksRouter: Router) {
  webhooksRouter.post(
    '/cloudflare',
    checkApiKey(ENV.CLOUDFLARE_API_KEY),
    validateRequest({ body: RequestBodySchema }),
    async (req, res) => {
      await confirmUploads.execute({ uploads: req.body.objects });
      res.sendStatus(StatusCodes.OK);
    },
  );
}

const RequestBodySchema = z.object({
  event: z.literal(['r2.upload.confirmed']),
  objects: z
    .array(
      z.object({
        key: z.string(),
        sizeBytes: z.number(),
        mimeType: z.union([
          z.string().regex(/^(image|audio|video)\/[a-zA-Z0-9\-+]+$/),
          z.literal('application/octet-stream'),
        ]),
      }),
    )
    .nonempty(),
});

openapiRegistry.registerPath({
  method: 'post',
  path: '/api/v1/webhooks/cloudflare',
  summary: 'Webhook for Cloudflare',
  description: `
Triggered by Cloudflare worker on events:
- r2.upload.confirmed
`,
  request: {
    body: {
      content: {
        'application/json': {
          schema: RequestBodySchema,
        },
      },
    },
  },
  tags: ['Uploads', 'R2', 'Webhooks'],
  responses: {
    [StatusCodes.OK]: { description: 'OK' },
    ...InvalidApiKeyResponse,
    ...ValidationErrorResponse,
    ...InternalServerErrorResponse,
  },
});
