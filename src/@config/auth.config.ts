import fs from 'node:fs';
import type { AuthPolicy } from 'src/auth/services/auth.service.js';
import type { JwtConfig } from 'src/auth/services/token.service.js';

if (!process.env.JWT_PRIVATE_KEY_PATH || !process.env.JWT_PUBLIC_KEY_PATH) {
  throw new Error('[env] JWT key paths are missing');
}

export const authPolicy: AuthPolicy = {
  accessTokenExpiresIn: '15m',
  refreshTokenExpiresIn: '7d',
};

export const jwtConfig: JwtConfig = {
  algorithm: 'RS256',
  privateKey: fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH, 'utf-8'),
  publicKey: fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH, 'utf-8'),
};
