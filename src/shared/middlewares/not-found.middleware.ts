import { NotFoundError } from '../errors/not-found.error.js';
import type { Next, Req, Res } from '../types/request.types.js';

export function notFoundHandler(req: Req, res: Res, next: Next) {
  const err = new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`);
  next(err);
}
