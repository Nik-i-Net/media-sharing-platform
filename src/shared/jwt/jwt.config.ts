import type { JwtConfig } from '../types/jwt.types.js';
import { loadJwtKeys } from './jwt.load-keys.js';

const { privateKey, publicKey } = loadJwtKeys(
  process.env.JWT_PRIVATE_KEY_PATH,
  process.env.JWT_PUBLIC_KEY_PATH,
);

const jwtConfig: JwtConfig = {
  accessTokenExpiresIn: '15m',
  refreshTokenExpiresIn: '7d',
  algorithm: 'RS256',
  privateKey,
  publicKey,
};

export { jwtConfig };
