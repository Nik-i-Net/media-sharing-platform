import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { HttpError } from './http.error.js';

export class NotFoundError extends HttpError {
  constructor(message?: string) {
    super(message ?? ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND);
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super('User not found');
  }
}
