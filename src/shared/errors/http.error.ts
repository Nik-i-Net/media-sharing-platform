import { StatusCodes } from 'http-status-codes';

export class HttpError extends Error {
  public readonly statusCode: StatusCodes;
  constructor(message: string, statusCode: StatusCodes) {
    super(message);
    this.statusCode = statusCode;
  }
}
