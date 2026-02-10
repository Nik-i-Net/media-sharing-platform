import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import type { Next, Req } from '../types';
import { ValidationException } from '@core/errors';

type ValidateRequestSchemas<Params, Body, Query> = {
  params?: ZodType<Params>;
  body?: ZodType<Body>;
  query?: ZodType<Query>;
};

export function validateRequest<Params, Body, Query>(
  schemas: ValidateRequestSchemas<Params, Body, Query>,
): RequestHandler<Params, unknown, Body, Query> {
  return (req: Req, _res, next: Next) => {
    const errors: { message: string; path: string }[] = [];

    for (const prop of ['params', 'body', 'query'] as const) {
      if (schemas[prop] === undefined) continue;

      const parseResult = schemas[prop].safeParse(req[prop]);
      if (parseResult.success) {
        req[prop] = parseResult.data;
      } else {
        parseResult.error.issues.forEach((err) => {
          errors.push({ message: err.message, path: [prop, ...err.path].join('.') });
        });
      }
    }

    if (errors.length) {
      throw new ValidationException(errors);
    }

    next();
  };
}
