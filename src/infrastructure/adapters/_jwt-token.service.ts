import jwt from 'jsonwebtoken';
import type { Algorithm, JwtPayload, PrivateKey, PublicKey, SignOptions, VerifyOptions } from 'jsonwebtoken';
import type { TokenService, Payload } from '../../application/ports/token.service';
import type { Duration } from '@core/types';

export type JwtConfig = {
  algorithm: Algorithm;
  issuer: string;
  audience: string;
  privateKey: PrivateKey;
  publicKey: PublicKey;
};

export class JwtTokenService implements TokenService {
  constructor(private readonly config: JwtConfig) {}

  async sign(payload: Payload, expiresIn: Duration): Promise<string> {
    const token = await this.signAsync(payload, this.config.privateKey, {
      algorithm: this.config.algorithm,
      issuer: this.config.issuer,
      audience: this.config.audience,
      expiresIn: expiresIn,
    });
    return token;
  }

  async verify(token: string): Promise<Payload> {
    const payload = await this.verifyAsync(token, this.config.publicKey, {
      algorithms: [this.config.algorithm],
      issuer: this.config.issuer,
      audience: this.config.audience,
    });
    return payload;
  }

  private signAsync(payload: JwtPayload, privateKey: PrivateKey, options: SignOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, privateKey, options, (err, token) => {
        if (err) return reject(err);
        if (!token) return reject(new Error('Failed to sign JWT: token is undefined'));
        resolve(token);
      });
    });
  }

  private verifyAsync(token: string, publicKey: PublicKey, options: VerifyOptions): Promise<JwtPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, publicKey, options, (err, payload) => {
        if (err) return reject(err);
        if (!payload || typeof payload === 'string') {
          return reject(new Error('Invalid payload'));
        }
        resolve(payload);
      });
    });
  }
}
