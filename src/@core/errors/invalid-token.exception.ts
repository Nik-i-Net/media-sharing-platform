import { BaseError } from './base.error';
import { codes } from './constants';

export class InvalidTokenException extends BaseError {
  constructor(message?: string) {
    super(message ?? 'Invalid token', codes.invalidToken);
  }
}
