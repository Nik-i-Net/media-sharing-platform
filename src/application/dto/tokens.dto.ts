import { z } from 'zod';
import { Token } from './primitives.dto.js';

export const RefreshTokenDto = z.object({ refreshToken: Token }).brand<'RefreshTokenDto'>();
export type RefreshTokenDto = z.infer<typeof RefreshTokenDto>;

export const AccessTokenDto = z.object({ accessToken: Token }).brand<'AccessTokenDto'>();
export type AccessTokenDto = z.infer<typeof AccessTokenDto>;
