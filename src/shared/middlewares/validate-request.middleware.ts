import type { ZodType } from 'zod';
import type { Request, RequestHandler } from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';
import { ValidationError, type ValidationIssue } from '../errors';

type ValidateRequestSchemas<TParams, TBody, TQuery> = {
  params?: ZodType<TParams>;
  body?: ZodType<TBody>;
  query?: ZodType<TQuery>;
};

export function validateRequest<TParams extends ParamsDictionary, TBody, TQuery extends Query>(
  schemas: ValidateRequestSchemas<TParams, TBody, TQuery>,
): RequestHandler<TParams, unknown, TBody, TQuery> {
  return (req: Request, _res, next) => {
    const issues: ValidationIssue[] = [];

    for (const key of ['params', 'body', 'query'] as const) {
      if (schemas[key] === undefined) continue;

      const parseResult = schemas[key].safeParse(req[key], { reportInput: true });
      if (parseResult.success) {
        req[key] = parseResult.data;
      } else {
        parseResult.error.issues.forEach((err) => {
          issues.push({
            message: err.message,
            code: err.code,
            location: key,
            path: err.path.map(String),
            value: String(err.input),
          });
        });
      }
    }

    if (issues.length) {
      throw new ValidationError(issues);
    }

    next();
  };
}
