import {
  ForbiddenErrorResponse,
  InternalServerErrorResponse,
  UnauthorizedErrorResponse,
  ValidationErrorResponse,
} from '@/shared/errors';
import { requireAuth, validateRequest } from '@/shared/middlewares';
import { openapiRegistry } from '@/shared/openapi-registry';
import { requireDefined } from '@/shared/utils';
import type { Router } from 'express-serve-static-core';
import { z } from 'zod';
import type { UpdateAlbumCommand } from '../application/update-album.command';
import type { Response } from 'express';
import { updateAlbum } from '@/app/di';

export function registerRoute(uploadsRouter: Router) {
  uploadsRouter.patch(
    '/:id', //
    requireAuth,
    validateRequest({ params: RequestParamsSchema, body: RequestBodySchema }),
    async (req, res: Response<void>) => {
      const cmd: UpdateAlbumCommand = {
        userId: requireDefined(req.user?.id),
        albumId: req.params.id,
      };

      if (req.body.name) cmd.name = req.body.name;
      if (req.body.isPublic !== undefined) cmd.isPublic = req.body.isPublic;

      await updateAlbum.execute(cmd);
      res.sendStatus(204);
    },
  );
}

const RequestParamsSchema = z.object({ id: z.uuid() });
const RequestBodySchema = z.object({
  name: z
    .string()
    .regex(/^(\w|\s|-)+$/)
    .max(50)
    .optional()
    .meta({ example: 'My Album' }),
  isPublic: z.boolean().optional(),
});

openapiRegistry.registerPath({
  method: 'patch',
  path: '/api/v1/albums/{id}',
  summary: 'Update album',
  description: `
Partially updates an existing album identified by its ID.
Only provided fields are modified; unspecified fields remain unchanged.`,
  request: {
    headers: z.object({
      Authorization: z.templateLiteral(['Bearer ', z.jwt()]).meta({ description: 'Bearer `JWT`' }),
    }),
    params: RequestParamsSchema,
    body: {
      description: 'Fields to update',
      content: { 'application/json': { schema: RequestBodySchema } },
    },
  },
  tags: ['Albums'],
  responses: {
    204: { description: 'Successfully updated the album' },
    ...UnauthorizedErrorResponse,
    ...ForbiddenErrorResponse,
    ...ValidationErrorResponse,
    ...InternalServerErrorResponse,
  },
});
