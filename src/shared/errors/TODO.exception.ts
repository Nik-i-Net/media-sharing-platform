import { StatusCodes } from '@shared/constants';
import { BaseError } from './base.error';

export class TodoException extends BaseError {
  readonly httpStatusCode = StatusCodes.BAD_REQUEST;

  constructor(message: string) {
    super(message ?? 'Todo', 'TODO');
  }
}
