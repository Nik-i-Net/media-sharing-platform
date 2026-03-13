import { BaseError } from './base.error';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

export class NotFoundException extends BaseError {
  readonly httpStatusCode = StatusCodes.NOT_FOUND;

  constructor(message: string, code: string) {
    super(message ?? ReasonPhrases.NOT_FOUND, code ?? 'NOT_FOUND');
  }
}
