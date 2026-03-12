import { StatusCodes } from 'http-status-codes';
import { AccessTokenPayload, Token } from '../../application/dto';
import { ZodError } from 'zod';
import { InvalidTokenException } from '../../core/errors/invalid-token.exception';
import type { TokenService } from '../../application/ports/token.service';
import type { RequestHandler } from 'express';

export type JwtAuthMiddleware = (roles?: string[]) => RequestHandler;

export function createJwtAuthMiddleware(tokenService: TokenService): JwtAuthMiddleware {
  return function (roles?: string[]): RequestHandler {
    return async function (req, res, next) {
      try {
        const rawToken = req.get('Authorization')?.split(' ')[1];
        const token = Token.parse(rawToken);
        const rawPayload = await tokenService.verify(token);
        const payload = AccessTokenPayload.parse(rawPayload);

        if (roles && !roles.some((role) => payload.roles.includes(role))) {
          res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' });
        }

        req.user = { id: payload.sub, roles: payload.roles };
        next();
      } catch (err) {
        if (err instanceof ZodError || err instanceof InvalidTokenException) {
          res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Missing or invalid access token' });
        }
      }
    };
  };
}
