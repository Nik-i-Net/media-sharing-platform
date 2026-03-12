import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export function unknownRouteHandler(req: Request, res: Response) {
  res.status(StatusCodes.NOT_FOUND).json({
    message: `${req.method} ${req.originalUrl} not found`,
    code: 'NOT_FOUND',
  });
}
