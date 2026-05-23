import { listUserAlbums } from '@/di';
import {
  InternalServerErrorResponse,
  UnauthorizedErrorResponse,
  ValidationErrorResponse,
} from '@/shared/errors';
import { checkJwt } from '@/shared/middlewares';
import { openapiRegistry } from '@/shared/openapi-registry';
import { requireDefined } from '@/shared/utils';
import type { Request, Response } from 'express';
import type { Router } from 'express-serve-static-core';
import z from 'zod';

export function registerRoute(uploadsRouter: Router) {
  uploadsRouter.get(
    '/', //
    checkJwt(),
    async (req: Request, res: Response<z.infer<typeof ResponseSchema>>) => {
      const result = await listUserAlbums.execute({
        userId: requireDefined(req.user?.id),
        page: Number(req.query.page),
        limit: Number(req.query.limit),
      });
      const response = ResponseSchema.decode(result);
      res.status(200).json(response);
    },
  );
}

const RequestQueriesSchema = z.object({
  page: z.string().regex(/^\d+$/, { error: 'Not a positive number' }).optional(),
  limit: z.string().regex(/^\d+$/, { error: 'Not a positive number' }).optional(),
});

const ResponseSchema = z
  .object({
    data: z.array(
      z.object({
        id: z.uuid(),
        name: z.string(),
        isPublic: z.boolean(),
        totalItems: z.int().nonnegative(),
        createdAt: z.date(),
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
    200: {
      description: 'A paginated list of albums.',
      content: { 'application/json': { schema: ResponseSchema } },
    },
    ...UnauthorizedErrorResponse,
    ...ValidationErrorResponse,
    ...InternalServerErrorResponse,
  },
});
