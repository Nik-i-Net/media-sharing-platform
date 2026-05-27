import { z } from 'zod';
import { StatusCodes } from '../constants';
import { BaseError, type OpenapiErrorResponse } from './base.error';

export class InternalServerError extends BaseError {
  readonly httpStatusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  constructor(message: string, code: string) {
    super(message ?? 'Internal server error', code ?? 'INTERNAL_SERVER_ERROR');
  }
}

export const InternalServerErrorResponse = {
  [StatusCodes.INTERNAL_SERVER_ERROR]: {
    description: 'Internal server error',
    content: {
      'application/json': {
        schema: z.object({
          error: z.object({
            message: z.string().meta({ example: 'Internal server error' }),
            code: z.literal('INternalServerError'),
          }),
        }),
      },
    },
  },
} satisfies OpenapiErrorResponse;

// openapiRegistry.registerComponent('responses', 'InternalServerError', {
//   description: 'Internal server error',
//   content: {
//     'application/json': {
//       schema: {
//         type: 'object',
//         properties: {
//           message: { type: 'string' },
//           code: { type: 'string' },
//         },
//       },
//       example: {
//         message: 'Internal server error',
//         code: 'INTERNAL_SERVER_ERROR',
//       },
//     },
//   },
// });
