import fs from 'node:fs';
import path from 'node:path';
import { env } from './env.loader';
import type { AuthPolicy } from '../application/auth.service';
import type { JwtConfig } from '../infrastructure/adapters/jwt-token.service';

export const authPolicy: AuthPolicy = {
  accessTokenExpiresIn: '15m',
  refreshTokenExpiresIn: '7d',
};

export const jwtConfig: JwtConfig = {
  algorithm: 'RS256',
  issuer: env.JWT_ISSUER,
  audience: env.JWT_AUDIENCE,
  privateKey: fs.readFileSync(path.join(env.SECRETS_PATH, 'jwt-private.pem'), 'utf-8'),
  publicKey: fs.readFileSync(path.join(env.SECRETS_PATH, 'jwt-public.pem'), 'utf-8'),
};
