import { StatusCodes } from 'http-status-codes';
import type { Req, Res } from '../types';

export function unknownRouteHandler(req: Req, res: Res) {
  res.status(StatusCodes.NOT_FOUND).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
}
