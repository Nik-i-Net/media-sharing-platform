import type { RequestHandler } from 'express';
import { createClient } from '@redis/client';
import { BadRequestError, TooManyRequestsError } from '../errors';
import { ENV } from '../env.loader';

const client = await createClient({
  socket: {
    host: ENV.REDIS_HOST,
    port: Number(ENV.REDIS_PORT),
  },
})
  .on('error', (err) => console.error('Redis Client Error', err))
  .connect();

export function ratelimit(opts: {
  scope: string;
  windowSec: number;
  limit: number;
  guestLimit?: number;
}): RequestHandler {
  return async (req, res, next) => {
    const userId = req.user?.id;
    const isGuest = !userId;

    if (isGuest && !req.ip) {
      throw new BadRequestError('Guest IP is required');
    }

    const limit = isGuest ? (opts.guestLimit ?? opts.limit) : opts.limit;

    const nowSeconds = Math.floor(Date.now() / 1000);
    const windowId = Math.floor(nowSeconds / opts.windowSec);

    const key = isGuest
      ? `rl:${opts.scope}:guest:ip=${req.ip}:window=${windowId}`
      : `rl:${opts.scope}:user:id=${userId}:window=${windowId}`;

    const value = await client.incr(key);
    if (value === 1) {
      await client.expire(key, opts.windowSec);
    }

    const remaining = limit - value;
    const reset = (windowId + 1) * opts.windowSec;

    res.set({
      'RateLimit-Limit': String(limit),
      'RateLimit-Remaining': String(Math.max(remaining, 0)),
      'RateLimit-Reset': String(reset),
    });

    if (remaining < 0) {
      res.set('Retry-After', String(reset - nowSeconds));
      throw new TooManyRequestsError();
    }

    next();
  };
}
