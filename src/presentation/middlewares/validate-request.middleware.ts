import { ValidationException } from '@core/errors';
import type { Request, RequestHandler } from 'express';
import type { ZodType } from 'zod';
import type { ParamsDictionary, Query } from 'express-serve-static-core';

type ValidateRequestSchemas<TParams, TBody, TQuery> = {
  params?: ZodType<TParams>;
  body?: ZodType<TBody>;
  query?: ZodType<TQuery>;
};

export function validateRequest<TParams extends ParamsDictionary, TBody, TQuery extends Query>(
  schemas: ValidateRequestSchemas<TParams, TBody, TQuery>,
): RequestHandler<TParams, unknown, TBody, TQuery> {
  return (req: Request, _res, next) => {
    const errors: { message: string; path: string[] }[] = [];

    for (const key of ['params', 'body', 'query'] as const) {
      if (schemas[key] === undefined) continue;

      const parseResult = schemas[key].safeParse(req[key]);
      if (parseResult.success) {
        req[key] = parseResult.data;
      } else {
        parseResult.error.issues.forEach((err) => {
          errors.push({ message: err.message, path: [key, ...err.path.map(String)] });
        });
      }
    }

    if (errors.length) {
      throw new ValidationException(errors);
    }

    next();
  };
}
