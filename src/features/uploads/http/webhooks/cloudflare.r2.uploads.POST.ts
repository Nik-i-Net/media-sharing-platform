import { confirmUploads } from '@/di';
import { ENV } from '@/shared/env.loader';
import { ValidationErrorResponse, InternalServerErrorResponse } from '@/shared/errors';
import { checkApiKey, InvalidApiKeyResponse, validateRequest } from '@/shared/middlewares';
import { openapiRegistry } from '@/shared/openapi-registry';
import assert from 'assert';
import type { Router } from 'express';
import { z } from 'zod';

export function registerRoute(webhooksRouter: Router) {
  webhooksRouter.post(
    '/cloudflare/r2/uploads',
    checkApiKey(ENV.CLOUDFLARE_API_KEY),
    validateRequest({ body: RequestBodySchema }),
    async (req, res) => {
      assert(req.body.event === 'upload.confirmed');
      await confirmUploads.execute({ uploads: req.body.objects });
      res.sendStatus(200);
    },
  );
}

const RequestBodySchema = z.object({
  event: z.literal('upload.confirmed'),
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
  path: '/api/v1/webhooks/cloudflare.r2.uploads',
  summary: 'Webhook for R2 upload confirmation',
  description: 'Triggered by Cloudflare Worker after processing batch messages from a queue.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: RequestBodySchema,
        },
      },
    },
  },
  tags: ['Uploads', 'R2', 'Webhooks', 'Integrations'],
  responses: {
    204: { description: 'OK' },
    ...InvalidApiKeyResponse,
    ...ValidationErrorResponse,
    ...InternalServerErrorResponse,
  },
});
