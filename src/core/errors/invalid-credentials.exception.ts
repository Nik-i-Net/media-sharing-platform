import { BaseError } from './base.error';
import { codes } from './constants';

export class InvalidCredentialsException extends BaseError {
  constructor() {
    super('Invalid credentials', codes.invalidCredentials);
  }
}
