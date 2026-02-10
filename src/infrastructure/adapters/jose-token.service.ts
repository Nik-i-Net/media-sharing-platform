import { SignJWT, jwtVerify, errors } from 'jose';
import type { TokenService, Payload } from '../../application/ports/token.service';
import type { Duration } from '@core/types';
import { InvalidTokenException } from '@core/errors/invalid-token.exception';

export type JwtConfig = {
  algorithm: `RS${256 | 384 | 512}`; // NOTE: check Ed25519/ES/PS
  issuer: string;
  audience: string;
  privateKey: CryptoKey;
  publicKey: CryptoKey;
};

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
        throw new InvalidTokenException();
      }

      throw err;
    }
  }
}
