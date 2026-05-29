import {
  ForbiddenErrorResponse,
  InternalServerErrorResponse,
  UnauthorizedErrorResponse,
  ValidationErrorResponse,
} from '@/shared/errors';
import { requireAuth, validateRequest } from '@/shared/middlewares';
import { openapiRegistry } from '@/shared/openapi-registry';
import type { Response, Router } from 'express';
import { z } from 'zod';
import type { UpdateUploadInfoCommand } from '../application/update-upload-info.command';
import { requireDefined } from '@/shared/utils';
import { updateUploadInfo } from '@/app/di';

export function registerRoute(uploadsRouter: Router) {
  uploadsRouter.patch(
    '/:id', //
    requireAuth,
    validateRequest({ params: RequestParamsSchema, body: RequestBodySchema }),
    async (req, res: Response<void>) => {
      const cmd: UpdateUploadInfoCommand = {
        userId: requireDefined(req.user?.id),
        uploadId: req.params.id,
      };

      if (req.body.fileName) cmd.fileName = req.body.fileName;
      if (req.body.isPublic !== undefined) cmd.isPublic = req.body.isPublic;

      await updateUploadInfo.execute(cmd);
      res.sendStatus(204);
    },
  );
}

const RequestParamsSchema = z.object({ id: z.uuid() });
const RequestBodySchema = z.object({
  fileName: z
    .string()
    .regex(/^(\w|\s|-)+$/)
    .max(50)
    .optional()
    .meta({ example: 'Cat' }),
  isPublic: z.boolean().optional(),
});

openapiRegistry.registerPath({
  method: 'patch',
  path: '/api/v1/uploads/{id}',
  summary: 'Update upload info',
  description: `
Partially updates an existing upload info identified by its ID.
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
  tags: ['Uploads'],
  responses: {
    204: { description: 'Successfully updated the upload info' },
    ...UnauthorizedErrorResponse,
    ...ForbiddenErrorResponse,
    ...ValidationErrorResponse,
    ...InternalServerErrorResponse,
  },
});
