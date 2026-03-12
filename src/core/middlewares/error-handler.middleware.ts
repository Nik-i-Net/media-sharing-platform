import { BaseError } from '@common/errors/base.error';
import { NotFoundException, ValidationException } from '@common/errors';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import type { Request, Response, NextFunction } from 'express';

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (!(err instanceof BaseError)) {
    handleUnknownError(err, req, res);
  }

  if (err instanceof NotFoundException) {
    return res.status(err.httpStatusCode).json({
      message: err.message,
      code: err.code,
    });
  } else if (err instanceof ValidationException) {
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
    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    code: 'INTERNAL_SERVER_ERROR',
  });
}
