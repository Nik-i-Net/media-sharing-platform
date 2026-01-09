import { AppError } from './app.error.js';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export class HttpError extends AppError {
  public readonly statusCode: StatusCodes;
  constructor(message: string, statusCode: StatusCodes) {
    super(message);
    this.statusCode = statusCode;
  }
}

// 4xx
export class NotFoundError extends HttpError {
  constructor(message?: string) {
    super(message ?? ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND);
  }
}

export class ConflictError extends HttpError {
  constructor(message?: string) {
    super(message ?? ReasonPhrases.CONFLICT, StatusCodes.CONFLICT);
  }
}

// 5xx
export class InternalServerError extends HttpError {
  constructor(message?: string) {
    super(message ?? ReasonPhrases.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
