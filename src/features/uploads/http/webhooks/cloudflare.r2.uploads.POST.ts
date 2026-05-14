import { confirmUploads } from '@/di';
import { ENV } from '@/shared/env.loader';
import { checkApiKey, validateRequest } from '@/shared/middlewares';
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
      await confirmUploads.execute(req.body.objects);
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

// // --- Schema Definitions ---
// const UploadWebhookSchema = registry.register('UploadWebhook', z.object({
//   uploads: z.array(z.object({
//     uploadId: z.string().uuid().openapi({ description: 'The ID linked to your DB' }),
//     key: z.string().openapi({ example: 'uploads/2024/01/file.png' }),
//     status: z.enum(['success', 'failure']),
//     metadata: z.record(z.string()).optional()
//   }))
// }));
//
// // --- Path Registration ---
// registry.registerPath({
//   method: 'post',
//   path: '/api/v1/webhooks/r2-uploads',
//   summary: 'Webhook for R2 upload completion',
//   description: 'Triggered by Cloudflare Worker after batch file processing',
//   request: {
//     body: {
//       content: {
//         'application/json': {
//           schema: UploadWebhookSchema
//         }
//       }
//     }
//   },
//   responses: {
//     200: {
//       description: 'Webhook processed successfully',
//       content: {
//         'application/json': {
//           schema: z.object({ received: z.boolean() })
//         }
//       }
//     },
//     401: { description: 'Unauthorized - Invalid webhook secret' }
//   }
// });
