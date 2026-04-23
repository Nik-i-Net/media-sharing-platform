import { z } from 'zod';
import { StatusCodes } from '../constants';
import { BaseError, type ErrorResponse } from './base.error';

const message = 'Internal server error';
const code = 'INTERNAL_SERVER_ERROR';

export class InternalServerError extends BaseError {
  readonly httpStatusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  constructor() {
    super(message, code);
  }
}

export const InternalServerErrorResponse = {
  [StatusCodes.INTERNAL_SERVER_ERROR]: {
    description: 'Internal server error',
    content: {
      'application/json': {
        schema: z.object({
          error: z.object({
            message: z.literal(message),
            code: z.literal(code),
          }),
        }),
      },
    },
  },
} satisfies ErrorResponse;

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
