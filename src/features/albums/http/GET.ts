import { listUserAlbums } from '@/app/di';
import { StatusCodes } from '@/shared/constants';
import {
  InternalServerErrorResponse,
  UnauthorizedErrorResponse,
  ValidationErrorResponse,
} from '@/shared/errors';
import { requireAuth } from '@/shared/middlewares';
import { openapiRegistry } from '@/shared/openapi-registry';
import { requireDefined } from '@/shared/utils';
import { validateRequest } from '@/shared/utils/validate-request';
import { isoDateSchema } from '@/shared/utils/zod';
import type { Request, Response } from 'express';
import type { Router } from 'express-serve-static-core';
import { z } from 'zod';

export function registerRoute(uploadsRouter: Router) {
  uploadsRouter.get(
    '/', //
    requireAuth,
    async (req: Request, res: Response<z.input<typeof ResponseSchema>>) => {
      const validated = validateRequest(req.query, RequestQueriesSchema, 'query');

      const userId = requireDefined(req.user?.id);
      const page = Number(validated.page ?? 1);
      const limit = Number(validated.limit ?? 20);

      const result = await listUserAlbums.execute({ userId, page, limit });
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

const RequestQueriesSchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, { error: 'Not a positive number' })
    .transform((v) => Number(v))
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/, { error: 'Not a positive number' })
    .transform((v) => Number(v))
    .optional(),
});

export const ResponseSchema = z
  .object({
    data: z.array(
      z.object({
        id: z.uuid(),
        name: z.string(),
        isPublic: z.boolean(),
        totalItems: z.int().nonnegative(),
        createdAt: isoDateSchema,
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
  path: '/api/v1/albums',
  summary: 'List albums',
  description: `Returns a paginated list of albums created by the authenticated user`,
  request: {
    headers: z.object({
      Authorization: z.templateLiteral(['Bearer ', z.jwt()]).meta({ description: 'Bearer `JWT`' }),
    }),
    query: RequestQueriesSchema,
  },
  tags: ['Albums'],
  responses: {
    [StatusCodes.OK]: {
      description: 'A paginated list of albums.',
      content: { 'application/json': { schema: ResponseSchema } },
    },
    ...UnauthorizedErrorResponse,
    ...ValidationErrorResponse,
    ...InternalServerErrorResponse,
  },
});
