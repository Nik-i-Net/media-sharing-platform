import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import type { Req, Res, Next } from '../express.types.ts';
import { isDatabaseError, mapDatabaseError } from '../../persistence/postgres-error-mapper.js';
import { BaseError } from '@shared/domain/errors/base.error.js';
import { NotFoundException } from '@shared/domain/errors/not-found.exception.js';
import { AlreadyExistsException } from '@shared/domain/errors/already-exists.exception.js';
import { ValidationException } from '@shared/application/errors/validation.exception.js';

function errorHandler(err: unknown, req: Req, res: Res, _next: Next) {
  if (isDatabaseError(err)) err = mapDatabaseError(err);

  if (!(err instanceof BaseError)) {
    logUnknownErrors(err, req.method, req.url);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }

  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  const details: { errors?: unknown[] } = {};
  // Domain
  if (err instanceof NotFoundException) statusCode = StatusCodes.NOT_FOUND;
  if (err instanceof AlreadyExistsException) statusCode = StatusCodes.CONFLICT;

  // Application
  if (err instanceof ValidationException) {
    statusCode = StatusCodes.BAD_REQUEST;
    details.errors = err.errors;
  }

  if (statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
    return res.sendStatus(statusCode);
  }

  res.status(statusCode).json({ message: err.message, code: err.code, ...details });
}

function logUnknownErrors(err: unknown, method: string, url: string) {
  console.error(`[${method}] ${url}`);

  if (err instanceof Error) {
    console.error(err.stack || err.message);
  } else if (typeof err === 'string') {
    console.error(err);
  } else {
    console.error('Unknown error:', err);
  }
}

export { errorHandler };
