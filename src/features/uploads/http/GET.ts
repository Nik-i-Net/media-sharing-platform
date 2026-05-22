import { listUserUploads } from '@/di';
import {
  InternalServerErrorResponse,
  UnauthorizedErrorResponse,
  ValidationErrorResponse,
} from '@/shared/errors';
import { checkJwt } from '@/shared/middlewares';
import { openapiRegistry } from '@/shared/openapi-registry';
import { requireDefined } from '@/shared/utils';
import type { Request, Response, Router } from 'express';
import z from 'zod';
import type { ListUserUploadsQuery } from '../application/list-user-uploads.query';
import { validateRequest } from '@/shared/utils/validate-request';

export function registerRoute(uploadsRouter: Router) {
  uploadsRouter.get(
    '/', //
    checkJwt(),
    async (req: UnknownRequest, res: Response<z.infer<typeof ResponseSchema>>) => {
      const validated = validateRequest(req.query, RequestQueriesSchema, 'query');

      const query: ListUserUploadsQuery = {
        userId: requireDefined(req.user?.id),
        page: Number(validated.page),
        limit: Number(validated.limit),
      };

      const result = await listUserUploads.execute(query);
      const response = ResponseSchema.decode(result);
      res.status(200).json(response);
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
        expiresAt: z.date().nullable(),
        createdAt: z.date(),
      }),
    ),
    meta: z.object({
      page: z.int().positive(),
      limit: z.int().positive().meta({ example: 20 }),
      totalItems: z.int().positive().meta({ example: 42 }),
      totalPages: z.int().positive().meta({ example: 3 }),
    }),
  })
  .brand<'Response'>();

openapiRegistry.registerPath({
  method: 'get',
  path: '/api/v1/uploads',
  summary: 'List uploaded files',
  description:
    'Returns a paginated list of metadata for all files uploaded by the authenticated user',
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
    200: {
      description: 'A paginated list of file metadata objects successfully retrieved.',
      content: { 'application/json': { schema: ResponseSchema } },
    },
    ...UnauthorizedErrorResponse,
    ...ValidationErrorResponse,
    ...InternalServerErrorResponse,
  },
});
