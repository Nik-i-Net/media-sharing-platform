import fs from 'node:fs';
import type { JwtConfig } from './jwt.types.js';

if (!process.env.JWT_PRIVATE_KEY_PATH || !process.env.JWT_PUBLIC_KEY_PATH) {
  throw new Error('[env] JWT key paths are missing');
}

const jwtConfig: JwtConfig = {
  accessTokenExpiresIn: '15m',
  refreshTokenExpiresIn: '7d',
  algorithm: 'RS256',
  privateKey: fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH, 'utf-8'),
  publicKey: fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH, 'utf-8'),
};

export { jwtConfig };
