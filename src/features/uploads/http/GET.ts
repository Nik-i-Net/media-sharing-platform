import { listUserUploads } from '@/app/di';
import { StatusCodes } from '@/shared/constants';
import {
  InternalServerErrorResponse,
  UnauthorizedErrorResponse,
  ValidationErrorResponse,
} from '@/shared/errors';
import { requireAuth } from '@/shared/middlewares';
import { openapiRegistry } from '@/shared/openapi-registry';
import { requireDefined } from '@/shared/utils';
import { validateRequest } from '@/shared/utils/validate-request';
import { isoDateSchema } from '@/shared/utils/zod';
import type { Request, Response, Router } from 'express';
import { z } from 'zod';

export function registerRoute(uploadsRouter: Router) {
  uploadsRouter.get(
    '/', //
    requireAuth,
    async (req: UnknownRequest, res: Response<z.input<typeof ResponseSchema>>) => {
      const validated = validateRequest(req.query, RequestQueriesSchema, 'query');

      const userId = requireDefined(req.user?.id);
      const page = Number(validated.page ?? 1);
      const limit = Number(validated.limit ?? 20);

      const result = await listUserUploads.execute({ userId, page, limit });
      const response = ResponseSchema.encode({
        data: result.data,
        meta: {
          page,
          limit,
          totalItems: result.totalItems,
          totalPages: Math.ceil(result.totalItems / limit) || 1,
        },
      });
      res.status(StatusCodes.OK).json(response);
    },
  );
}

type UnknownRequest = Request<unknown, unknown, unknown, unknown>;

const RequestQueriesSchema = z.object({
  page: z.string().regex(/^\d+$/, { error: 'Not a positive number' }).optional(),
  limit: z.string().regex(/^\d+$/, { error: 'Not a positive number' }).optional(),
});

const ResponseSchema = z
  .object({
    data: z.array(
      z.object({
        id: z.uuid(),
        fileName: z.string(),
        mimeType: z.string(),
        sizeBytes: z.number(),
        previewUrl: z.string(),
        isPublic: z.boolean(),
        expiresAt: isoDateSchema.nullable(),
        createdAt: isoDateSchema,
      }),
    ),
    meta: z.object({
      page: z.int().positive(),
      limit: z.int().positive().meta({ example: 20 }),
      totalItems: z.int().nonnegative().meta({ example: 42 }),
      totalPages: z.int().positive().meta({ example: 3 }),
    }),
  })
  .brand<'Response', 'in'>();

openapiRegistry.registerPath({
  method: 'get',
  path: '/api/v1/uploads',
  summary: 'List uploads',
  description: 'Returns a paginated list of metadata for user uploads',
  request: {
    headers: z.object({
      Authorization: z
        .templateLiteral(['Bearer ', z.jwt()]) //
        .meta({ description: 'Bearer `JWT`' }),
    }),
    query: RequestQueriesSchema,
  },
  tags: ['Uploads'],
  responses: {
    [StatusCodes.OK]: {
      description: 'A paginated list of uploads metadata.',
      content: { 'application/json': { schema: ResponseSchema } },
    },
    ...UnauthorizedErrorResponse,
    ...ValidationErrorResponse,
    ...InternalServerErrorResponse,
  },
});
