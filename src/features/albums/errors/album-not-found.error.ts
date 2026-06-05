import { StatusCodes } from '@/shared/constants';
import { NotFoundError, type OpenapiErrorResponse } from '@/shared/errors';
import { z } from 'zod';

export class AlbumNotFoundError extends NotFoundError {
  constructor() {
    super('Album not found', 'ALBUM_NOT_FOUND');
  }
}

export const AlbumNotFoundErrorResponse = {
  [StatusCodes.NOT_FOUND]: {
    description: 'Album not found',
    content: {
      'application/json': {
        schema: z.object({
          error: z.object({
            message: z.string().meta({ example: 'Album not found' }),
            code: z.literal('ALBUM_NOT_FOUND'),
          }),
        }),
      },
    },
  },
} satisfies OpenapiErrorResponse;
