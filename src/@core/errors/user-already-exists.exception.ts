import { capitalize } from '@core/utils';
import { BaseError } from './base.error';
import { codes, reasons } from './constants';

export class UserAlreadyExistsException extends BaseError {
  public readonly errors: unknown[] = [];

  constructor(fields: string[]) {
    super('User already exists', codes.userAlreadyExists);

    for (const field of fields) {
      this.errors.push({
        message: `${capitalize(field)} is already taken. Choose another one`,
        reason: reasons.alreadyExists,
        field,
      });
    }
  }
}
