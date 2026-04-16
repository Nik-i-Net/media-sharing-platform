import { StatusCodes } from '@shared/constants';
import type { Request, Response } from 'express';

export function unknownRouteHandler(req: Request, res: Response) {
  res.status(StatusCodes.NOT_FOUND).json({
    message: `${req.method} ${req.originalUrl} not found`,
    code: 'NOT_FOUND',
  });
}
