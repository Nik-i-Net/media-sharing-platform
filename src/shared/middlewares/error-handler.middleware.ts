import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from '../constants';
import { NotFoundError, ValidationError } from '../errors';
import { BaseError } from '../errors/base.error';

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (!(err instanceof BaseError)) {
    handleUnknownError(err, req, res);
  }

  if (err instanceof NotFoundError) {
    return res.status(err.httpStatusCode).json({
      message: err.message,
      code: err.code,
    });
  } else if (err instanceof ValidationError) {
    return res.status(err.httpStatusCode).json({
      message: err.message,
      code: err.code,
      details: err.issues,
    });
  }

  handleUnknownError(new Error('Unhandled BaseError'), req, res);
}

function handleUnknownError(err: unknown, req: Request, res: Response) {
  console.error(`${req.method} ${req.url}`);

  if (err instanceof Error) {
    console.error('UnknownError:', err.stack || err.message);
  } else {
    console.error('UnknownError:', err);
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
  });
}
