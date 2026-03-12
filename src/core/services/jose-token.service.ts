import { SignJWT, jwtVerify, errors } from 'jose';
import type { Duration } from '@common/types';

export type JwtConfig = {
  algorithm: `RS${256 | 384 | 512}`; // NOTE: check Ed25519/ES/PS
  issuer: string;
  audience: string;
  privateKey: CryptoKey;
  publicKey: CryptoKey;
};

type Payload = Record<string, unknown>;
export interface TokenService {
  sign(payload: Payload, expiresIn: Duration): Promise<string>;
  verify(token: string): Promise<Payload>;
}

export class JoseTokenService implements TokenService {
  constructor(private readonly config: JwtConfig) {}

  async sign(payload: Payload, expiresIn: Duration): Promise<string> {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: this.config.algorithm })
      .setIssuedAt()
      .setIssuer(this.config.issuer)
      .setAudience(this.config.audience)
      .setExpirationTime(expiresIn)
      .sign(this.config.privateKey);

    return token;
  }

  async verify(token: string) {
    try {
      const { payload } = await jwtVerify(token, this.config.publicKey, {
        algorithms: [this.config.algorithm],
        issuer: this.config.issuer,
        audience: this.config.audience,
      });

      return payload;
    } catch (err) {
      if (err instanceof errors.JOSEError) {
        // NOTE: not every JOSEError means an invalid token
        throw new Error('TODO: InvalidTokenException');
      }

      throw err;
    }
  }
}
