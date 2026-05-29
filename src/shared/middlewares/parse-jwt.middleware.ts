import type { NextFunction, Request, Response } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { JOSEError } from 'jose/errors';
import { ENV } from '../env.loader';

const JWKS = createRemoteJWKSet(new URL(`${ENV.JWT_ISSUER}/.well-known/jwks.json`), {
  cooldownDuration: 60 * 60 * 1000, // 1 hour
});

export async function parseJwt(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const [scheme, token] = authHeader?.split(' ') ?? [];

  if (scheme !== 'Bearer' || !token) {
    return next();
  }

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: ENV.JWT_ISSUER + '/',
      audience: ENV.JWT_AUDIENCE,
      algorithms: ['RS256'],
    });

    const userId = payload[`${ENV.JWT_AUDIENCE}/userId`];
    if (userId && typeof userId === 'string') {
      req.user = { id: userId };
    }
  } catch (err) {
    if (!(err instanceof JOSEError)) {
      return next(err);
    }
  }

  next();
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
    };
  }
}
