import { getUploadById } from '@/app/di';
import {
  ValidationErrorResponse,
  InternalServerErrorResponse,
  UnauthorizedErrorResponse,
} from '@/shared/errors';
import { checkJwt, validateRequest } from '@/shared/middlewares';
import { openapiRegistry } from '@/shared/openapi-registry';
import type { Response, Router } from 'express';
import z from 'zod';

export function registerRoute(uploadsRouter: Router) {
  uploadsRouter.get(
    '/:id', //
    checkJwt({ requireAuth: false }),
    validateRequest({ params: RequestParamsSchema }),
    async (req, res: Response<z.infer<typeof ResponseSchema>>) => {
      const upload = await getUploadById.execute({
        uploadId: req.params.id,
        userId: req.user?.id ?? null,
      });
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
      }),
    ]),
  })
  .brand<'Response'>();

openapiRegistry.registerPath({
  method: 'get',
  path: '/api/v1/uploads/:id',
  summary: 'Get upload by ID',
  description: 'Returns  metadata for a file identified by its ID',
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
      description: 'Successful response containing the upload details for the requested ID',
      content: { 'application/json': { schema: ResponseSchema } },
    },
    ...UnauthorizedErrorResponse,
    ...ValidationErrorResponse,
    ...InternalServerErrorResponse,
  },
});
