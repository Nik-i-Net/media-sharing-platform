import { NotFoundError } from '@common/errors/http.errors.js';
import type { Next, Req, Res } from '@common/types/express.types.js';

export function notFoundHandler(req: Req, _res: Res, next: Next) {
  const err = new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`);
  next(err);
}
