import { unlinkUploadsFromAlbum } from '@/app/di';
import { StatusCodes } from '@/shared/constants';
import {
  InternalServerErrorResponse,
  UnauthorizedErrorResponse,
  ValidationErrorResponse,
} from '@/shared/errors';
import { checkJwt, validateRequest } from '@/shared/middlewares';
import { openapiRegistry } from '@/shared/openapi-registry';
import { requireDefined } from '@/shared/utils';
import type { Router } from 'express';
import { z } from 'zod';
import { AlbumAccessDeniedErrorResponse } from '../errors/album-access-denied.error';

export function registerRoute(albumsRouter: Router) {
  albumsRouter.delete(
    '/:id/uploads', //
    checkJwt(),
    validateRequest({ params: RequestParamsSchema, body: RequestBodySchema }),
    async (req, res) => {
      const userId = requireDefined(req.user?.id);
      const albumId = req.params.id;
      const uploadIds = req.body.uploadIds;
      await unlinkUploadsFromAlbum.execute({ userId, albumId, uploadIds });
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
  method: 'delete',
  path: '/api/v1/albums/{id}/uploads',
  summary: 'Unlink uploads from album',
  description: `
Unlinks the provided uploads from the album.  
Non existent pairs (albumId - uploadId) will be ignored.`,
  request: {
    headers: z.object({
      Authorization: z.templateLiteral(['Bearer ', z.jwt()]).meta({ description: 'Bearer `JWT`' }),
    }),
    body: {
      description: 'List of upload IDs to unlink from the album',
      content: { 'application/json': { schema: RequestBodySchema } },
    },
  },
  tags: ['Albums', 'Uploads'],
  responses: {
    [StatusCodes.NO_CONTENT]: { description: 'Successfully unlinked uploads from the album' },
    ...UnauthorizedErrorResponse,
    ...AlbumAccessDeniedErrorResponse,
    ...ValidationErrorResponse,
    ...InternalServerErrorResponse,
  },
});
