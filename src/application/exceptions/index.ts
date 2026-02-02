import { BaseError } from '@core/base.error.js';

export class UserNotFoundException extends BaseError {
  constructor(message?: string) {
    super(message ?? 'User not found', 'USER_NOT_FOUND');
  }
}

type ValidationErrors = { message: string; path: string }[];
export class ValidationException extends BaseError {
  constructor(public readonly errors: ValidationErrors) {
    const message = `Validation failed`;
    const code = `VALIDATION_FAILED`;
    super(message, code);
  }
}
