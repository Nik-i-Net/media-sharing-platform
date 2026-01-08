import type { PrivateKey, PublicKey, SignOptions } from 'jsonwebtoken';

type JwtToken = string;
type TokenType = 'access' | 'refresh';

type DefinedSignOptions<T extends keyof SignOptions> = Exclude<SignOptions[T], undefined>;
type JwtConfig = {
  accessTokenExpiresIn: DefinedSignOptions<'expiresIn'>;
  refreshTokenExpiresIn: DefinedSignOptions<'expiresIn'>;
  algorithm: DefinedSignOptions<'algorithm'>;
  privateKey: PrivateKey;
  publicKey: PublicKey;
};

export type { JwtToken, TokenType, JwtConfig };
