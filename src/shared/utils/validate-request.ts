import type { ZodType } from 'zod';
import { ValidationError } from '../errors';

export function validateRequest<T>(
  value: unknown,
  schema: ZodType<T>,
  location: 'params' | 'body' | 'query',
): T {
  const parseResult = schema.safeParse(value);
  if (parseResult.success) return parseResult.data;

  throw new ValidationError(
    parseResult.error.issues.map((err) => ({
      message: err.message,
      code: err.code,
      location,
      path: err.path.map(String),
      value: String(err.input),
    })),
  );
}
