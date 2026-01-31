import { BaseError } from '@shared/domain/errors/index.js';

type ValidationErrors = { message: string; path: string }[];

export class ValidationException extends BaseError {
  constructor(public readonly errors: ValidationErrors) {
    const message = `Validation failed`;
    const code = `VALIDATION_FAILED`;
    super(message, code);
  }
}
