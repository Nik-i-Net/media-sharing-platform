import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { NextFunction, Request, Response } from 'express';
import { ENV } from '@/config/env.loader';
import { StatusCodes } from '../constants';
import { TodoException } from '../errors';

const JWKS = createRemoteJWKSet(new URL(`${ENV.JWT_ISSUER}/.well-known/jwks.json`), {
  cooldownDuration: 60 * 60 * 1000, // 1 hour
});

export async function checkJwt(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const [scheme, token] = authHeader?.split(' ') ?? [];

  if (scheme !== 'Bearer' || !token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Missing or invalid token' });
  }

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: ENV.JWT_ISSUER + '/',
      audience: ENV.JWT_AUDIENCE,
      algorithms: ['RS256'],
    });

    const userId = payload[`${ENV.JWT_AUDIENCE}/userId`];
    if (!userId || typeof userId !== 'string') {
      throw new TodoException('Invalid userId');
    }
    req.user = { id: userId };

    next();
  } catch (error) {
    console.error('JWT Validation Error:', error);
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Token is invalid or expired' });
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
    };
  }
}
