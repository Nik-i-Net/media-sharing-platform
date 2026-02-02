import fs from 'node:fs';
import path from 'node:path';
import type { AuthPolicy } from 'src/application/auth.service.js';
import type { JwtConfig } from 'src/infrastructure/adapters/jwt-token.service.js';

const secretsPath = process.env.SECRETS_PATH;
if (!secretsPath) {
  throw new Error('[env] SECRETS_PATH is missing');
}

export const authPolicy: AuthPolicy = {
  accessTokenExpiresIn: '15m',
  refreshTokenExpiresIn: '7d',
};

export const jwtConfig: JwtConfig = {
  algorithm: 'RS256',
  privateKey: fs.readFileSync(path.join(secretsPath, 'jwt-private.pem'), 'utf-8'),
  publicKey: fs.readFileSync(path.join(secretsPath, 'jwt-private.pem'), 'utf-8'),
};
