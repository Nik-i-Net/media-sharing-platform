import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { InvalidTokenException } from '@common/errors/invalid-token.exception';
import { AccessTokenPayload } from '@features/auth/dto/access-token-payload.dto';
import { TokenSchema } from '@common/schemas/primitives.dto';
import type { TokenService } from '@core/services/ports/token.service';
import type { RequestHandler } from 'express';

export type JwtAuthMiddleware = (roles?: string[]) => RequestHandler;

export function createJwtAuthMiddleware(tokenService: TokenService): JwtAuthMiddleware {
  return function (roles?: string[]): RequestHandler {
    return async function (req, res, next) {
      try {
        const rawToken = req.get('Authorization')?.split(' ')[1];
        const token = TokenSchema.parse(rawToken);
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
