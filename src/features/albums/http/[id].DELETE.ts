import { deleteAlbum } from '@/di';
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

export function registerRoute(uploadsRouter: Router) {
  uploadsRouter.delete(
    '/:id', //
    checkJwt(),
    validateRequest({ params: z.object({ id: z.uuid() }) }),
    async (req, res) => {
      await deleteAlbum.execute({
        id: req.params.id,
        userId: requireDefined(req.user?.id),
      });
      res.sendStatus(204);
    },
  );
}

openapiRegistry.registerPath({
  method: 'delete',
  path: '/api/v1/albums/:id',
  summary: 'Delete album',
  description: `Deletes the album with the provided ID.`,
  request: {
    headers: z.object({
      Authorization: z.templateLiteral(['Bearer ', z.jwt()]).meta({ description: 'Bearer `JWT`' }),
    }),
  },
  tags: ['Albums'],
  responses: {
    204: { description: 'Successfully deleted the album' },
    ...UnauthorizedErrorResponse,
    ...ValidationErrorResponse,
    ...InternalServerErrorResponse,
  },
});
