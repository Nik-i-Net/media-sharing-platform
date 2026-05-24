import { StatusCodes } from '@/shared/constants';
import { ForbiddenError, type OpenapiErrorResponse } from '@/shared/errors';
import z from 'zod';

export class AlbumAccessDeniedError extends ForbiddenError {
  constructor(userId: string, albumId: string) {
    super(`User ${userId} does not have access to album ${albumId}`, 'ALBUM_ACCESS_DENIED');
  }
}

export const AlbumAccessDeniedErrorResponse = {
  [StatusCodes.FORBIDDEN]: {
    description: 'Access to album denied',
    content: {
      'application/json': {
        schema: z.object({
          error: z.object({
            message: z.string().meta({ example: 'Access to album denied' }),
            code: z.literal('ALBUM_ACCESS_DENIED'),
          }),
        }),
      },
    },
  },
} satisfies OpenapiErrorResponse;
