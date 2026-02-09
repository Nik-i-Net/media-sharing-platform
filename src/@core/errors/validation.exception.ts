import { BaseError } from './base.error';
import { codes } from './constants';

type ValidationErrors = { message: string; path: string }[];

export class ValidationException extends BaseError {
  constructor(public readonly errors: ValidationErrors) {
    super(`Validation failed`, codes.validationFailed);
  }
}
