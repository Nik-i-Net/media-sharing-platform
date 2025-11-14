import jwt from 'jsonwebtoken';
import type { JwtPayload, PrivateKey, PublicKey, SignOptions, VerifyOptions } from 'jsonwebtoken';
import type { JwtToken } from '../types/jwt.types.js';

async function signAsync(
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

async function verifyAsync(
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

export { signAsync, verifyAsync };
