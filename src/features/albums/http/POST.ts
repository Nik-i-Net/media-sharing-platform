import {
  InternalServerErrorResponse,
  UnauthorizedErrorResponse,
  ValidationErrorResponse,
} from '@/shared/errors';
import { checkJwt, validateRequest } from '@/shared/middlewares';
import { openapiRegistry } from '@/shared/openapi-registry';
import { requireDefined } from '@/shared/utils';
import type { Router } from 'express-serve-static-core';
import { z } from 'zod';
import type { CreateAlbumCommand } from '../application/create-album.command';
import type { Response } from 'express';
import { createAlbum } from '@/app/di';

export function registerRoute(uploadsRouter: Router) {
  uploadsRouter.post(
    '/', //
    checkJwt(),
    validateRequest({ body: RequestBodySchema }),
    async (req, res: Response<z.infer<typeof ResponseSchema>>) => {
      const cmd: CreateAlbumCommand = {
        userId: requireDefined(req.user?.id),
        name: req.body.name,
        isPublic: req.body.isPublic,
      };
      const albumId = await createAlbum.execute(cmd);
      const response = ResponseSchema.decode({ data: { id: albumId } });
      res.status(201).json(response);
    },
  );
}

const RequestBodySchema = z.object({
  name: z
    .string()
    .regex(/^(\w|\s|-)+$/)
    .max(50)
    .meta({ example: 'My Album' }),
  isPublic: z.boolean(),
});

const ResponseSchema = z
  .object({
    data: z.object({ id: z.uuid() }),
  })
  .brand<'Response'>();

openapiRegistry.registerPath({
  method: 'post',
  path: '/api/v1/albums',
  summary: 'Create album',
  description: `Creates a new album with the provided name and visibility settings.`,
  request: {
    headers: z.object({
      Authorization: z.templateLiteral(['Bearer ', z.jwt()]).meta({ description: 'Bearer `JWT`' }),
    }),
    body: {
      description: 'Payload containing the album data required to create a new album',
      content: { 'application/json': { schema: RequestBodySchema } },
    },
  },
  tags: ['Albums'],
  responses: {
    201: {
      description: 'Returns `id` of the newly created album',
      content: { 'application/json': { schema: ResponseSchema } },
    },
    ...UnauthorizedErrorResponse,
    ...ValidationErrorResponse,
    ...InternalServerErrorResponse,
  },
});
