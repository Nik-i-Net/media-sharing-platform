import {
  InternalServerErrorResponse,
  UnauthorizedErrorResponse,
  ValidationErrorResponse,
} from '@/shared/errors';
import { checkJwt } from '@/shared/middlewares';
import { openapiRegistry } from '@/shared/openapi-registry';
import { validateRequest } from '@/shared/utils/validate-request';
import type { Request, Response, Router } from 'express';
import { z } from 'zod';
import type { ListAlbumUploadsQuery } from '../application/list-album-uploads.query';
import { requireDefined } from '@/shared/utils';
import { listAlbumUploads } from '@/app/di';

export function registerRoute(albumsRouter: Router) {
  albumsRouter.get(
    '/:id/uploads', //
    checkJwt(),
    async (req: Request, res: Response<z.infer<typeof ResponseSchema>>) => {
      const validatedParams = validateRequest(req.params, RequestParamsSchema, 'params');
      const validatedQuery = validateRequest(req.query, RequestQueriesSchema, 'query');

      const query: ListAlbumUploadsQuery = {
        userId: requireDefined(req.user?.id),
        albumId: validatedParams.id,
        page: Number(validatedQuery.page),
        limit: Number(validatedQuery.limit),
      };

      const result = await listAlbumUploads.execute(query);
      const response = ResponseSchema.decode(result);
      res.status(200).json(response);
    },
  );
}

const RequestParamsSchema = z.object({ id: z.uuid() });

const RequestQueriesSchema = z.object({
  page: z.string().regex(/^\d+$/, { error: 'Not a positive number' }).optional(),
  limit: z.string().regex(/^\d+$/, { error: 'Not a positive number' }).optional(),
});

const PublicInfoSchema = z.object({
  id: z.uuid(),
  fileName: z.string(),
  mimeType: z.string(),
  sizeBytes: z.number(),
  previewUrl: z.string(),
});

const ResponseSchema = z
  .object({
    data: z.union([
      z.array(PublicInfoSchema),
      z.array(
        PublicInfoSchema.extend({
          isPublic: z.boolean(),
          expiresAt: z.date().nullable(),
          createdAt: z.date(),
        }),
      ),
    ]),
    meta: z.object({
      page: z.int().positive(),
      limit: z.int().positive().meta({ example: 20 }),
      totalItems: z.int().nonnegative().meta({ example: 42 }),
      totalPages: z.int().positive().meta({ example: 3 }),
    }),
  })
  .brand<'Response'>();

openapiRegistry.registerPath({
  method: 'get',
  path: '/api/v1/albums/:id/uploads',
  summary: 'List uploads in an album',
  description: `
Returns a paginated list of uploads metadata in an album.  
Owners will see all their uploads, while other users will only see public uploads.`,
  request: {
    headers: z.object({
      Authorization: z
        .templateLiteral(['Bearer ', z.jwt()]) //
        .optional()
        .meta({ description: 'Bearer `JWT`' }),
    }),
    query: RequestQueriesSchema,
  },
  tags: ['Albums', 'Uploads'],
  responses: {
    200: {
      description: 'A paginated list of uploads metadata in an album.',
      content: { 'application/json': { schema: ResponseSchema } },
    },
    ...UnauthorizedErrorResponse,
    ...ValidationErrorResponse,
    ...InternalServerErrorResponse,
  },
});
