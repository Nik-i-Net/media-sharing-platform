import jwt from 'jsonwebtoken';
import type { Algorithm, PrivateKey, PublicKey, JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';
import type { TokenService } from '../../application/ports/token.service.js';

export type JwtConfig = {
  algorithm: Algorithm;
  privateKey: PrivateKey;
  publicKey: PublicKey;
};

type TokenDuration = NonNullable<SignOptions['expiresIn']>;

export class JwtTokenService implements TokenService {
  constructor(private readonly config: JwtConfig) {}

  async sign(payload: JwtPayload, expiresIn: TokenDuration): Promise<string> {
    const { privateKey, algorithm } = this.config;
    const options: SignOptions = { algorithm, expiresIn };

    const token = await this._signAsync(payload, privateKey, options);
    return token;
  }

  async verify(token: string): Promise<JwtPayload> {
    const { publicKey, algorithm } = this.config;
    const options: VerifyOptions = { algorithms: [algorithm] };

    const payload = await this._verifyAsync(token, publicKey, options);
    return payload;
  }

  private _signAsync(payload: JwtPayload, privateKey: PrivateKey, options: SignOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, privateKey, options, (err, token) => {
        if (err) return reject(err);
        if (!token) return reject(new Error('Failed to sign JWT: token is undefined'));
        resolve(token);
      });
    });
  }

  private _verifyAsync(token: string, publicKey: PublicKey, options: VerifyOptions): Promise<JwtPayload> {
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
