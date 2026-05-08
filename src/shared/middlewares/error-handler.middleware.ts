import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from '../constants';
import { NotFoundError, UnauthorizedError, ValidationError } from '../errors';
import { BaseError } from '../errors/base.error';
import { z } from 'zod';

const ErrorResponseSchema = z
  .object({
    error: z.object({
      message: z.string(),
      code: z.string(),
      details: z.unknown().optional(),
    }),
  })
  .brand<'ErrorResponse'>();
type ResponseObject = z.infer<typeof ErrorResponseSchema>;
type ErrorObject = z.infer<typeof ErrorResponseSchema.shape.error>;

function errorEnvelope(err: ErrorObject): ResponseObject {
  return ErrorResponseSchema.decode({
    error: {
      message: err.message,
      code: err.code,
      details: err.details,
    },
  });
}

function respondWithInternalServerError(res: Response<ResponseObject>) {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
    errorEnvelope({
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
    }),
  );
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response<ResponseObject>,
  _next: NextFunction,
) {
  if (!(err instanceof BaseError)) {
    console.error('UnknownError');
    console.error(`Route: ${req.method} ${req.url}`);
    console.error(err instanceof Error ? err.stack || err.message : err);
    return respondWithInternalServerError(res);
  }

  if (
    err instanceof NotFoundError || //
    err instanceof UnauthorizedError
  ) {
    return res.status(err.httpStatusCode).json(errorEnvelope(err));
  }
  if (err instanceof ValidationError) {
    return res.status(err.httpStatusCode).json(errorEnvelope({ ...err, details: err.issues }));
  }

  respondWithInternalServerError(res);
}
