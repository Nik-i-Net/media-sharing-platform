import { signAsync, verifyAsync } from './jwt.utils.js';
import type { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';
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

export { JwtService };
