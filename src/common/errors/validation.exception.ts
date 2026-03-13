import { BaseError } from './base.error';
import { StatusCodes } from 'http-status-codes';

export type ValidationIssue = {
  value: unknown;
  message: string;
  code: string;
  location: string;
  path: string[];
};

export class ValidationException extends BaseError {
  readonly httpStatusCode = StatusCodes.UNPROCESSABLE_ENTITY;

  constructor(readonly issues: ValidationIssue[]) {
    super('Validation failed', 'VALIDATION_ERROR');
  }
}
