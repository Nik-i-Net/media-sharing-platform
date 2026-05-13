import type { Request, Response, NextFunction } from 'express';
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

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response<ResponseObject>,
  _next: NextFunction,
) {
  try {
    if (!(err instanceof BaseError)) throw err;

    if (
      err instanceof NotFoundError || //
      err instanceof UnauthorizedError
    ) {
      return res.status(err.httpStatusCode).json(errorEnvelope(err));
    }
    if (err instanceof ValidationError) {
      return res.status(err.httpStatusCode).json(errorEnvelope({ ...err, details: err.issues }));
    }

    throw err;
  } catch (err) {
    console.error('Unhandled Error');
    console.error(`Route: ${req.method} ${req.url}`);
    console.error(err instanceof Error ? err.stack || err.message : err);
    res.status(500).json({
      error: { message: 'Internal server error', code: 'INTERNAL_SERVER_ERROR' },
    } as ResponseObject);
  }
}
