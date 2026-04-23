import { StatusCodes } from '../constants';
import { BaseError } from './base.error';

export class NotFoundError extends BaseError {
  readonly httpStatusCode = StatusCodes.NOT_FOUND;

  constructor(message: string, code: string) {
    super(message ?? 'Not found', code ?? 'NOT_FOUND');
  }
}
