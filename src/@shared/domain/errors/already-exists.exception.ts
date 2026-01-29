import { BaseError } from './base.error.js';

export class AlreadyExistsException extends BaseError {
  constructor(subject: string) {
    const message = `${subject} already exists`;
    const code = `${subject.toUpperCase()}_NOT_FOUND`;
    super(message, code);
  }
}
