import jwt from 'jsonwebtoken';
import type { JwtPayload, PrivateKey, PublicKey, SignOptions, VerifyOptions } from 'jsonwebtoken';
import type { JwtConfig, JwtToken, TokenType } from '../types/jwt.types.js';

class JwtService {
  constructor(private readonly config: JwtConfig) {}

  async sign(payload: JwtPayload, tokenType: TokenType): Promise<JwtToken> {
    const { privateKey, algorithm } = this.config;
    const expiresIn = this.config[`${tokenType}TokenExpiresIn`];
    const options: SignOptions = { algorithm, expiresIn };

    const token = await signAsync(payload, privateKey, options);
    return token;
  }

  async verify(token: JwtToken): Promise<JwtPayload> {
    const { publicKey, algorithm } = this.config;
    const options: VerifyOptions = { algorithms: [algorithm] };

    const payload = await verifyAsync(token, publicKey, options);
    return payload;
  }
}

function signAsync(
  payload: JwtPayload,
  privateKey: PrivateKey,
  options: SignOptions,
): Promise<JwtToken> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) return reject(err);
      if (!token) return reject('Failed to sign JWT: token is undefined');
      resolve(token);
    });
  });
}

function verifyAsync(
  token: JwtToken,
  publicKey: PublicKey,
  options: VerifyOptions,
): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, publicKey, options, (err, payload) => {
      if (err) return reject(err);
      if (!payload || typeof payload === 'string') {
        return reject('Invalid payload');
      }
      resolve(payload);
    });
  });
}

export { JwtService };
