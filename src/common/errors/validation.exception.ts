import { StatusCodes } from 'http-status-codes';
import { BaseError } from './base.error';

type ValidationError = {
  path: string[];
  location: string;
  message: string;
  value: unknown;
};

export class ValidationException extends BaseError {
  readonly httpStatusCode = StatusCodes.UNPROCESSABLE_ENTITY;

  constructor(readonly errors: ValidationError[]) {
    super('Validation failed', 'VALIDATION_ERROR');
  }
}
