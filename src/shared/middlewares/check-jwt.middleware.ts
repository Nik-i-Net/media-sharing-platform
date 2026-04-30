import { createRemoteJWKSet, jwtVerify } from 'jose';
import { ENV } from '@/config/env.loader';
import { TodoError, UnauthorizedError } from '../errors';
import { JOSEError } from 'jose/errors';
import type { RequestHandler } from 'express';

const JWKS = createRemoteJWKSet(new URL(`${ENV.JWT_ISSUER}/.well-known/jwks.json`), {
  cooldownDuration: 60 * 60 * 1000, // 1 hour
});

export function checkJwt({ rejectRequest = true }): RequestHandler {
  return async (req, _res, next) => {
    const authHeader = req.headers.authorization;
    const [scheme, token] = authHeader?.split(' ') ?? [];

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedError('Missing or invalid token');
    }

    try {
      const { payload } = await jwtVerify(token, JWKS, {
        issuer: ENV.JWT_ISSUER + '/',
        audience: ENV.JWT_AUDIENCE,
        algorithms: ['RS256'],
      });

      const userId = payload[`${ENV.JWT_AUDIENCE}/userId`];
      if (!userId || typeof userId !== 'string') {
        throw new TodoError('Invalid userId');
      }
      req.user = { id: userId };

      next();
    } catch (err) {
      if (!rejectRequest) next();

      if (err instanceof JOSEError) {
        throw new UnauthorizedError();
      }
      throw err;
    }
  };
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
    };
  }
}
