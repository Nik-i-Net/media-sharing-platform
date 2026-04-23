import { StatusCodes } from '../constants';
import { BaseError, type ErrorResponse } from './base.error';
import { z } from 'zod';

export type ValidationIssue = {
  value: unknown;
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
          }),
        }),
      },
    },
  },
} satisfies ErrorResponse;
