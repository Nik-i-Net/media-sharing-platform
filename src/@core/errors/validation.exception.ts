import { BaseError } from './base.error';
import { codes } from './constants';

type ValidationError = { message: string; path: string[] };

export class ValidationException extends BaseError {
  constructor(public readonly errors: ValidationError[]) {
    super(`Validation failed`, codes.validationFailed);
  }
}
