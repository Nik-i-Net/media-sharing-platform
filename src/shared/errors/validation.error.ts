import { StatusCodes } from '../constants';
import { BaseError, type OpenapiErrorResponse } from './base.error';
import { z } from 'zod';

export type ValidationIssue = {
  value: string;
  message: string;
  code: string;
  location: string;
  path: string[];
};

export class ValidationError extends BaseError {
  readonly httpStatusCode = StatusCodes.UNPROCESSABLE_ENTITY;

  constructor(readonly issues: ValidationIssue[]) {
    super('Validation failed', 'VALIDATION_ERROR');
  }
}

export const ValidationErrorResponse = {
  [StatusCodes.UNPROCESSABLE_ENTITY]: {
    description: 'Validation error',
    content: {
      'application/json': {
        schema: z.object({
          error: z.object({
            message: z.literal('Validation failed'),
            code: z.literal('VALIDATION_ERROR'),
            issues: z.array(
              z.object({
                message: z.string().meta({ example: 'Invalid email address' }),
                code: z.string().meta({ example: 'invalid_format' }),
                location: z.string().meta({ example: 'body' }),
                path: z.array(z.string()).meta({ example: ['email'] }),
                value: z.string().meta({ example: '123' }),
              }),
            ),
          }),
        }),
      },
    },
  },
} satisfies OpenapiErrorResponse;
