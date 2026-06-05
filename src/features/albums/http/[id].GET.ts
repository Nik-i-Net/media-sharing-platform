import { getAlbumById } from '@/app/di';
import { StatusCodes } from '@/shared/constants';
import { InternalServerErrorResponse, ValidationErrorResponse } from '@/shared/errors';
import { validateRequest } from '@/shared/middlewares';
import { openapiRegistry } from '@/shared/openapi-registry';
import type { Response } from 'express';
import type { Router } from 'express-serve-static-core';
import { z } from 'zod';
import { AlbumNotFoundErrorResponse } from '../errors/album-not-found.error';

export function registerRoute(uploadsRouter: Router) {
  uploadsRouter.get(
    '/:id', //
    validateRequest({ params: RequestParamsSchema }),
    async (req, res: Response<z.infer<typeof ResponseSchema>>) => {
      const album = await getAlbumById.execute({
        albumId: req.params.id,
        userId: req.user?.id ?? null,
      });
      const response = ResponseSchema.decode({ data: album });
      res.status(StatusCodes.OK).json(response);
    },
  );
}

const RequestParamsSchema = z.object({ id: z.uuid() });

const BasicInfoSchema = z.object({
  id: z.uuid(),
  name: z.string(),
});

const ResponseSchema = z
  .object({
    data: z.discriminatedUnion('canEdit', [
      BasicInfoSchema.extend({ canEdit: z.literal(false) }),
      BasicInfoSchema.extend({
        canEdit: z.literal(true),
        isPublic: z.boolean(),
      }),
    ]),
  })
  .brand<'Response'>();

openapiRegistry.registerPath({
  method: 'get',
  path: '/api/v1/albums/{id}',
  summary: 'Get album',
  description: `Returns information about the album with the provided ID.`,
  request: {
    headers: z.object({
      Authorization: z
        .templateLiteral(['Bearer ', z.jwt()])
        .optional()
        .meta({ description: 'Bearer `JWT`' }),
    }),
    params: RequestParamsSchema,
  },
  tags: ['Albums'],
  responses: {
    [StatusCodes.OK]: {
      description: 'Album information.',
      content: { 'application/json': { schema: ResponseSchema } },
    },
    ...AlbumNotFoundErrorResponse,
    ...ValidationErrorResponse,
    ...InternalServerErrorResponse,
  },
});
