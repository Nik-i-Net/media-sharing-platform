import { StatusCodes } from '../constants';
import { BaseError } from './base.error';

export class TodoError extends BaseError {
  readonly httpStatusCode = StatusCodes.BAD_REQUEST;

  constructor(message: string) {
    super(message ?? 'Todo', 'TODO');
  }
}
