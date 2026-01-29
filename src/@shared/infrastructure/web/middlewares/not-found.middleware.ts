import { NotFoundException } from '@shared/domain/errors/index.js';
import type { Next, Req, Res } from '@shared/infrastructure/web/express.types.js';

export function notFoundHandler(req: Req, _res: Res, next: Next) {
  const err = new NotFoundException(`Route ${req.method} ${req.originalUrl} not found`);
  next(err);
}
