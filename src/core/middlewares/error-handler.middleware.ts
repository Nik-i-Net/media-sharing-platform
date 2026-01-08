import { StatusCodes } from 'http-status-codes';
import type { Req, Res, Next } from '@common/types/express.types.js';
import { HttpError } from '@common/errors/http.errors.js';
import { isPgError, mapPgError } from '@core/db/pg-error-handler.js';
import { AppError } from '@common/errors/app.error.js';

function errorHandler(err: unknown, req: Req, res: Res, _next: Next) {
  if (!(err instanceof AppError) && isPgError(err)) {
    err = mapPgError(err);
  }

  if (err instanceof HttpError) {
    const { message, statusCode } = err;
    res.status(statusCode).send(message);
    return;
  }

  console.error(`[${req.method}] ${req.url}`);
  if (err instanceof Error) {
    console.error(err.stack || err.message);
  } else if (typeof err === 'string') {
    console.error(err);
  } else {
    console.error('Unknown error:', err);
  }

  res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
}

export { errorHandler };
