import { listAlbumUploads } from '@/app/di';
import { InternalServerErrorResponse, ValidationErrorResponse } from '@/shared/errors';
import { openapiRegistry } from '@/shared/openapi-registry';
import { validateRequest } from '@/shared/utils/validate-request';
import type { Request, Response, Router } from 'express';
import { z } from 'zod';
import type { ListAlbumUploadsQuery } from '../application/list-album-uploads.query';
import { AlbumAccessDeniedErrorResponse } from '../errors/album-access-denied.error';

export function registerRoute(albumsRouter: Router) {
  albumsRouter.get(
    '/:id/uploads', //
    async (req: Request, res: Response<z.infer<typeof ResponseSchema>>) => {
      const validatedParams = validateRequest(req.params, RequestParamsSchema, 'params');
      const validatedQuery = validateRequest(req.query, RequestQueriesSchema, 'query');

      const query: ListAlbumUploadsQuery = { albumId: validatedParams.id };
      if (req.user?.id) query.userId = req.user.id;
      if (validatedQuery.page) query.page = Number(validatedQuery.page);
      if (validatedQuery.limit) query.limit = Number(validatedQuery.limit);

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

const ResponseSchema = z
  .object({
    data: z.array(
      z.object({
        id: z.uuid(),
        fileName: z.string(),
        mimeType: z.string(),
        sizeBytes: z.number(),
        previewUrl: z.string(),
        isPublic: z.boolean().optional(),
        expiresAt: z.date().nullable().optional(),
        createdAt: z.date().optional(),
      }),
    ),
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
  path: '/api/v1/albums/{id}/uploads',
  summary: 'List uploads in album',
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
    ...AlbumAccessDeniedErrorResponse,
    ...ValidationErrorResponse,
    ...InternalServerErrorResponse,
  },
});
