import { z } from 'zod';
import { token } from '@shared/application/primitives.dto.js';

export const RefreshTokenDto = z.object({ refreshToken: token }).brand<'RefreshTokenDto'>();
export type RefreshTokenDto = z.infer<typeof RefreshTokenDto>;

export const AccessTokenDto = z.object({ accessToken: token }).brand<'AccessTokenDto'>();
export type AccessTokenDto = z.infer<typeof AccessTokenDto>;
