import { createRemoteJWKSet, jwtVerify } from 'jose';
import { ENV } from '@/config/env.loader';
import { UnauthorizedError, type ErrorResponse } from '../errors';
import { JOSEError } from 'jose/errors';
import type { RequestHandler } from 'express';
import { StatusCodes } from '../constants';
import { z } from 'zod';

const JWKS = createRemoteJWKSet(new URL(`${ENV.JWT_ISSUER}/.well-known/jwks.json`), {
  cooldownDuration: 60 * 60 * 1000, // 1 hour
});

export function checkJwt(): RequestHandler {
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
        throw new UnauthorizedError('Invalid userId');
      }
      req.user = { id: userId };

      next();
    } catch (err) {
      if (err instanceof JOSEError) {
        throw new UnauthorizedError();
      }
      throw err;
    }
  };
}

export const UnauthorizedResponse = {
  [StatusCodes.UNAUTHORIZED]: {
    description: 'Missing or invalid `Authorization` header',
    content: {
      'application/json': {
        schema: z.object({
          error: z.object({
            message: z.literal('Authorization required'),
            code: z.literal('UNAUTHORIZED'),
          }),
        }),
      },
    },
  },
} satisfies ErrorResponse;

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
    };
  }
}
