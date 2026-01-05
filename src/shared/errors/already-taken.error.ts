import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { HttpError } from './http.error.js';

export class AlreadyTakenError extends HttpError {
  constructor(property?: string) {
    const message = property ? `${property} already taken` : ReasonPhrases.CONFLICT;
    super(message, StatusCodes.CONFLICT);
  }
}

