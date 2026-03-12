import type { AuthPolicy } from '@features/auth/auth.service';

export const authPolicy: AuthPolicy = {
  accessTokenExpiresIn: '15m',
  refreshTokenExpiresIn: '7d',
};
