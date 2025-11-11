import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../errors/http.error.js';
import type { Req, Res, Next } from '../types/request.types.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorHandler(err: unknown, req: Req, res: Res, next: Next) {
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
