import { createRemoteJWKSet, jwtVerify } from 'jose';
import { UnauthorizedError } from '../errors';
import { JOSEError } from 'jose/errors';
import type { RequestHandler } from 'express';
import { ENV } from '../env.loader';

const JWKS = createRemoteJWKSet(new URL(`${ENV.JWT_ISSUER}/.well-known/jwks.json`), {
  cooldownDuration: 60 * 60 * 1000, // 1 hour
});

type Options = { requireAuth?: boolean };

export function checkJwt(opts: Options = { requireAuth: true }): RequestHandler {
  return async (req, _res, next) => {
    const authHeader = req.headers.authorization;
    const [scheme, token] = authHeader?.split(' ') ?? [];

    try {
      if (scheme !== 'Bearer' || !token) {
        throw new UnauthorizedError();
      }

      const { payload } = await jwtVerify(token, JWKS, {
        issuer: ENV.JWT_ISSUER + '/',
        audience: ENV.JWT_AUDIENCE,
        algorithms: ['RS256'],
      });

      const userId = payload[`${ENV.JWT_AUDIENCE}/userId`];
      if (!userId || typeof userId !== 'string') {
        throw new UnauthorizedError();
      }
      req.user = { id: userId };

      next();
    } catch (err) {
      const isAuthError = err instanceof JOSEError || err instanceof UnauthorizedError;
      if (isAuthError && opts.requireAuth === false) {
        return next();
      }

      throw err instanceof JOSEError ? new UnauthorizedError() : err;
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
