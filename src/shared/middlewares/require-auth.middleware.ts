import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors';

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const userId = req.user?.id;
  if (!userId) {
    throw new UnauthorizedError();
  }

  next();
}
