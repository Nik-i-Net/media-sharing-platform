import type { RequestHandler } from 'express';
import type { ZodError, ZodType } from 'zod';
import type { Next, Req } from '../express.types.js';
import { ValidationException } from '@shared/application/errors/validation.exception.js';

type ValidateRequestOptions<P = unknown, B = unknown, Q = unknown> = {
  params?: ZodType<P>;
  body?: ZodType<B>;
  query?: ZodType<Q>;
};

export function validateRequest<P = unknown, B = unknown, Q = unknown>(
  schemas: ValidateRequestOptions<P, B, Q>,
): RequestHandler<P, unknown, B, Q> {
  return async (req: Req, _res, next: Next) => {
    const [paramsErrors, bodyErrors, queryErrors] = await Promise.all([
      schemas.params?.safeParseAsync(req.params).then((result) => {
        if (!result.success) return result.error;
        req.params = result.data;
      }),

      schemas.body?.safeParseAsync(req.body).then((result) => {
        if (!result.success) return result.error;
        req.body = result.data;
      }),

      schemas.query?.safeParseAsync(req.query).then((result) => {
        if (!result.success) return result.error;
        req.query = result.data;
      }),
    ]);

    const errors: { message: string; path: string }[] = [];
    function collectErrors(path: string, zodError: ZodError) {
      zodError.issues.forEach((err) => {
        errors.push({ message: err.message, path: [path, ...err.path].join('.') });
      });
    }
    if (paramsErrors) collectErrors('params', paramsErrors);
    if (bodyErrors) collectErrors('body', bodyErrors);
    if (queryErrors) collectErrors('query', queryErrors);

    if (errors.length) {
      throw new ValidationException(errors);
    }

    next();
  };
}

//
// import { z } from 'zod';
// import { ValidationException } from '@shared/application/errors/validation.exception.js';
//
// const Id = z.object({ id: z.object({ uuid: z.uuidv4() }) });
// const Age = z.object({ age: z.number() });
// const Email = z.object({ email: z.email() });
//
// // const result = await req.safeParseAsync({ id: crypto.randomUUID() + 5 });
// const handler = validateRequest({ params: Id, body: Age, query: Email });
//
// const params = { id: { id: 5 } };
// const body = { age: '33' };
// const query = { email: 'test' };
// const req = { params, body, query } as unknown as Req<{ id: { uuid: string } }, { age: number }, { email: string }>;
//
// handler(req, {} as Res, {} as Next);
//
// // if (!result.success) throw new Error('Invalid id')
