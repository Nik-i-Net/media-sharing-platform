import { getUploadById } from '@/di';
import {
  ValidationErrorResponse,
  InternalServerErrorResponse,
  UnauthorizedErrorResponse,
} from '@/shared/errors';
import { checkJwt, validateRequest } from '@/shared/middlewares';
import { openapiRegistry } from '@/shared/openapi-registry';
import type { Response } from 'express';
import type { Router } from 'express-serve-static-core';
import z from 'zod';

export function registerRoute(uploadsRouter: Router) {
  uploadsRouter.get(
    '/:id', //
    checkJwt({ requireAuth: false }),
    validateRequest({ params: RequestParamsSchema }),
    async (req, res: Response<z.infer<typeof ResponseSchema>>) => {
      const uploadId = req.params.id;
      const userId = req.user?.id ?? null;
      const upload = await getUploadById.execute(uploadId, userId);
      const response = ResponseSchema.decode({ data: upload });
      res.status(200).json(response);
    },
  );
}

const RequestParamsSchema = z.object({
  id: z.uuid(),
});

const BasicInfoSchema = z.object({
  id: z.uuid(),
  fileName: z.string(),
  mimeType: z.string(),
  sizeBytes: z.number(),
  url: z.string(),
});

const ResponseSchema = z
  .object({
    data: z.discriminatedUnion('canEdit', [
      BasicInfoSchema.extend({ canEdit: z.literal(false) }),
      BasicInfoSchema.extend({
        canEdit: z.literal(true),
        isPublic: z.boolean(),
        expiresAt: z.date().nullable(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    ]),
  })
  .brand<'Response'>();

openapiRegistry.registerPath({
  method: 'get',
  path: '/api/v1/uploads/:id',
  summary: 'TODO',
  description: `TODO`,
  request: {
    headers: z.object({
      Authorization: z
        .templateLiteral(['Bearer ', z.jwt()])
        .optional()
        .meta({ description: 'Bearer `JWT`' }),
    }),
    params: RequestParamsSchema,
  },
  tags: ['Uploads'],
  responses: {
    200: {
      description: 'Information about requested file',
      content: { 'application/json': { schema: ResponseSchema } },
    },
    ...UnauthorizedErrorResponse,
    ...ValidationErrorResponse,
    ...InternalServerErrorResponse,
  },
});
