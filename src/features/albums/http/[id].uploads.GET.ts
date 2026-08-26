import { listAlbumUploads } from '@/app/di';
import { StatusCodes } from '@/shared/constants';
import { InternalServerErrorResponse, ValidationErrorResponse } from '@/shared/errors';
import { openapiRegistry } from '@/shared/openapi-registry';
import { validateRequest } from '@/shared/utils/validate-request';
import type { Request, Response, Router } from 'express';
import { z } from 'zod';
import { AlbumAccessDeniedErrorResponse } from '../errors/album-access-denied.error';

export function registerRoute(albumsRouter: Router) {
  albumsRouter.get(
    '/:id/uploads', //
    async (req: Request, res: Response<z.input<typeof ResponseSchema>>) => {
      const validatedParams = validateRequest(req.params, RequestParamsSchema, 'params');
      const validatedQuery = validateRequest(req.query, RequestQueriesSchema, 'query');

      const userId = req.user?.id;
      const albumId = validatedParams.id;
      const page = Number(validatedQuery.page ?? 1);
      const limit = Number(validatedQuery.limit ?? 20);

      const result = await listAlbumUploads.execute({ userId, albumId, page, limit });
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
  .brand<'Response', 'in'>();

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
    params: RequestParamsSchema,
    query: RequestQueriesSchema,
  },
  tags: ['Albums', 'Uploads'],
  responses: {
    [StatusCodes.OK]: {
      description: 'A paginated list of uploads metadata in an album.',
      content: { 'application/json': { schema: ResponseSchema } },
    },
    ...AlbumAccessDeniedErrorResponse,
    ...ValidationErrorResponse,
    ...InternalServerErrorResponse,
  },
});
