import { StatusCodes } from '@/shared/constants';
import { NotFoundError, type OpenapiErrorResponse } from '@/shared/errors';
import { z } from 'zod';

export class UploadNotFoundError extends NotFoundError {
  constructor() {
    super('Upload not found', 'UPLOAD_NOT_FOUND');
  }
}

export const UploadNotFoundErrorResponse = {
  [StatusCodes.NOT_FOUND]: {
    description: 'Upload not found',
    content: {
      'application/json': {
        schema: z.object({
          error: z.object({
            message: z.string().meta({ example: 'Upload not found' }),
            code: z.literal('UPLOAD_NOT_FOUND'),
          }),
        }),
      },
    },
  },
} satisfies OpenapiErrorResponse;
