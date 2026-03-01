import fs from 'node:fs';
import path from 'node:path';
import { ENV } from './env.loader';
import type { AuthPolicy } from '../application/auth.service';
import type { JwtConfig } from '../infrastructure/adapters/jose-token.service';
import { importPKCS8, importSPKI } from 'jose';

export const authPolicy: AuthPolicy = {
  accessTokenExpiresIn: '15m',
  refreshTokenExpiresIn: '7d',
};

const rawJwtPrivate = fs.readFileSync(path.join(ENV.SECRETS_PATH, 'jwt-private.pem'), 'utf-8');
const rawJwtPublic = fs.readFileSync(path.join(ENV.SECRETS_PATH, 'jwt-public.pem'), 'utf-8');
const algorithm = 'RS256';

export const jwtConfig: JwtConfig = {
  algorithm,
  issuer: ENV.JWT_ISSUER,
  audience: ENV.JWT_AUDIENCE,
  privateKey: await importPKCS8(rawJwtPrivate, algorithm),
  publicKey: await importSPKI(rawJwtPublic, algorithm),
};
