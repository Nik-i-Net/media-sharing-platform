import { StatusCodes } from 'http-status-codes';
import type { Next, Req, Res } from '../types';
import type { TokenService } from '../../application/ports/token.service';
import { AccessTokenPayload, Token } from '../../application/dto';
import { ZodError } from 'zod';
import { InvalidTokenException } from '@core/errors/invalid-token.exception';

export function createJwtAuthMiddleware(tokenService: TokenService) {
  return async function (req: Req, res: Res, next: Next) {
    try {
      const rawToken = req.get('Authorization')?.split(' ')[1];
      const token = Token.parse(rawToken);
      const rawPayload = await tokenService.verify(token);
      const payload = AccessTokenPayload.parse(rawPayload);

      req.user = { userId: payload.sub };
      next();
    } catch (err) {
      if (err instanceof ZodError || err instanceof InvalidTokenException) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Missing or invalid access token' });
      }
    }
  };
}
