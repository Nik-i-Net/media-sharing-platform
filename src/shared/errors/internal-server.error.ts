import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { HttpError } from './http.error.js';

export class InternalServerError extends HttpError {
  constructor(message?: string) {
    super(message ?? ReasonPhrases.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

