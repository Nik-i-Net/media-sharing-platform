import { BaseError } from './base.error';
import { codes } from './constants';

export class UserNotFoundException extends BaseError {
  constructor() {
    super('User not found', codes.userNotFound);
  }
}
