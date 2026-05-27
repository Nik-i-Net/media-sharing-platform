import { StatusCodes } from '../constants';
import { BaseError } from './base.error';

export class TodoError extends BaseError {
  readonly httpStatusCode = StatusCodes.BAD_REQUEST;
  readonly details?: unknown;

  constructor(message: string, code?: string, details?: unknown) {
    super(message ?? 'Todo', code ?? 'TODO');
    this.details = details;
  }
}
