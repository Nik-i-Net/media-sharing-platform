import { StatusCodes } from '../constants';
import { BaseError } from './base.error';

export class BadRequestError extends BaseError {
  readonly httpStatusCode = StatusCodes.BAD_REQUEST;
  readonly cause?: unknown;

  constructor(message: string, code: string, opts?: { cause?: unknown }) {
    super(message ?? 'Bad request', code ?? 'BAD_REQUEST');
    if (opts?.cause) this.cause = opts.cause;
  }
}
