import { BaseError } from './base.error';
import { StatusCodes } from 'http-status-codes';

export class TodoException extends BaseError {
  readonly httpStatusCode = StatusCodes.BAD_REQUEST;

  constructor(message: string) {
    super(message ?? 'Todo', 'TODO');
  }
}
