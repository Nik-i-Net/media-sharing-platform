import { linkUploadsToAlbum } from '@/app/di';
import { StatusCodes } from '@/shared/constants';
import {
  ForbiddenErrorResponse,
  InternalServerErrorResponse,
  UnauthorizedErrorResponse,
  ValidationErrorResponse,
} from '@/shared/errors';
import { requireAuth, validateRequest } from '@/shared/middlewares';
import { openapiRegistry } from '@/shared/openapi-registry';
import { requireDefined } from '@/shared/utils';
import type { Router } from 'express';
import { z } from 'zod';

export function registerRoute(albumsRouter: Router) {
  albumsRouter.post(
    '/:id/uploads', //
    requireAuth,
    validateRequest({ params: RequestParamsSchema, body: RequestBodySchema }),
    async (req, res) => {
      const userId = requireDefined(req.user?.id);
      const albumId = req.params.id;
      const uploadIds = req.body.uploadIds;
      await linkUploadsToAlbum.execute({ userId, albumId, uploadIds });
      res.sendStatus(StatusCodes.NO_CONTENT);
    },
  );
}

const RequestParamsSchema = z.object({
  id: z.uuid(),
});

const RequestBodySchema = z.object({
  uploadIds: z.array(z.uuid()),
});

openapiRegistry.registerPath({
  method: 'post',
  path: '/api/v1/albums/{id}/uploads',
  summary: 'Link uploads to album',
  description: `
Links the provided uploads to the album.  
Trying to link not existing uploads and/or albums will result in the \`ForbiddenError\`, as well as trying to link resources a user does not have access to.
Duplicates (uploads already linked to the album) will be ignored.`,
  request: {
    headers: z.object({
      Authorization: z.templateLiteral(['Bearer ', z.jwt()]).meta({ description: 'Bearer `JWT`' }),
    }),
    body: {
      description: 'List of upload IDs to link to the album',
      content: { 'application/json': { schema: RequestBodySchema } },
    },
  },
  tags: ['Albums', 'Uploads'],
  responses: {
    [StatusCodes.NO_CONTENT]: { description: 'Successfully linked uploads to the album' },
    ...UnauthorizedErrorResponse,
    ...ForbiddenErrorResponse, // NOTE: could be `AlbumAccessDeniedError` or `UploadsAccessDeniedError`
    // TODO: unique constraint violation
    ...ValidationErrorResponse,
    ...InternalServerErrorResponse,
  },
});
