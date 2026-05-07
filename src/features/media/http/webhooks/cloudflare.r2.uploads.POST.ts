import { validateRequest } from '@/shared/middlewares';
import type { Router } from 'express';
import { z } from 'zod';

const RequestBodySchema = z.object({
  data: z.array(
    z.object({
      object: z.object({
        id: z.string(),
        storage: z.object({
          bucket: z.string(),
          key: z.string(),
        }),
      }),
    }),
  ),
});

export function registerRoute(webhooksRouter: Router) {
  webhooksRouter.post(
    '/batch/confirm',
    validateRequest({ body: RequestBodySchema }),
    async (req, res) => {
      console.log('webhook', req.body.data[0]?.object);
      res.sendStatus(200);
    },
  );
}

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
