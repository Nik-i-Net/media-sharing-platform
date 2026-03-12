import fs from 'node:fs';
import { ENV } from './env.loader';
import { importPKCS8, importSPKI } from 'jose';
import type { JwtConfig } from '../infrastructure/adapters/jose-token.service';

const algorithm = 'RS256';

export const jwtConfig: JwtConfig = {
  algorithm,
  issuer: ENV.JWT_ISSUER,
  audience: ENV.JWT_AUDIENCE,
  privateKey: await importPKCS8(fs.readFileSync(ENV.JWT_PRIVATE_KEY_PATH, 'utf-8'), algorithm),
  publicKey: await importSPKI(fs.readFileSync(ENV.JWT_PUBLIC_KEY_PATH, 'utf-8'), algorithm),
};
