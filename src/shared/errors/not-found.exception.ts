import { StatusCodes } from '@shared/constants';
import { BaseError } from './base.error';

export class NotFoundException extends BaseError {
  readonly httpStatusCode = StatusCodes.NOT_FOUND;

  constructor(message: string, code: string) {
    super(message ?? 'Not found', code ?? 'NOT_FOUND');
  }
}
