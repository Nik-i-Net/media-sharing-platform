import jwt from 'jsonwebtoken';
import type {
  JwtPayload,
  PrivateKey,
  PublicKey,
  SignCallback,
  SignOptions,
  VerifyCallback,
  VerifyOptions,
} from 'jsonwebtoken';
import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { JwtService } from '@src/shared/jwt/jwt.service.js';
import type { JwtConfig, JwtToken, TokenType } from '@src/shared/types/jwt.types.js';

jest.mock('jsonwebtoken');

const mockedJwtSign = jest.mocked<
  (payload: JwtPayload, key: PrivateKey, opts: SignOptions, cb: SignCallback) => void
>(jwt.sign);

const mockedJwtVerify = jest.mocked<
  (token: JwtToken, key: PublicKey, opts: VerifyOptions, cb: VerifyCallback) => void
>(jwt.verify);

const jwtConfig: JwtConfig = {
  accessTokenExpiresIn: '15m',
  refreshTokenExpiresIn: '7d',
  algorithm: 'RS256',
  privateKey: 'test-private-key',
  publicKey: 'test-public-key',
};

const jwtService = new JwtService(jwtConfig);

const token = 'valid.jwt.token';
const payload = { role: 'user' };

beforeEach(() => {
  jest.resetAllMocks();
});

describe('jwtService.sign()', () => {
  const tokenType: TokenType = 'access';
  const signOptions: SignOptions = {
    algorithm: jwtConfig.algorithm,
    expiresIn: jwtConfig[`${tokenType}TokenExpiresIn`],
  };

  test('should call jwt.sign with correct args and return the token', async () => {
    mockedJwtSign.mockImplementation((_, __, ___, cb) => cb(null, token));

    const result = await jwtService.sign(payload, tokenType);

    expect(mockedJwtSign).toHaveBeenCalledWith(
      payload,
      jwtConfig.privateKey,
      signOptions,
      expect.any(Function),
    );
    expect(result).toBe(token);
  });

  test('should reject when jwt.sign returns an error', async () => {
    const err = new Error('jwt.sign error');
    mockedJwtSign.mockImplementation((_, __, ___, cb) => cb(err));

    expect(jwtService.sign(payload, tokenType)).rejects.toThrow(err);
  });

  test('should reject when token is undefined', async () => {
    const err = new Error('Failed to sign JWT: token is undefined');
    mockedJwtSign.mockImplementation((_, __, ___, cb) => cb(null, undefined));

    expect(jwtService.sign(payload, tokenType)).rejects.toThrow(err);
  });
});

describe('jwtService.verify()', () => {
  const verifyOptions: VerifyOptions = {
    algorithms: [jwtConfig.algorithm],
  };

  test('should call jwt.verify with correct args and return the payload', async () => {
    mockedJwtVerify.mockImplementation((_, __, ___, cb) => cb(null, payload));

    const result = await jwtService.verify(token);

    expect(mockedJwtVerify).toHaveBeenCalledWith(
      token,
      jwtConfig.publicKey,
      verifyOptions,
      expect.any(Function),
    );
    expect(result).toEqual(payload);
  });

  test('should reject when jwt.verify returns an error', async () => {
    const err = new Error('jwt.verify error');
    mockedJwtVerify.mockImplementation((_, __, ___, cb) => cb(err as jwt.VerifyErrors));

    expect(jwtService.verify(token)).rejects.toThrow(err);
  });

  test('should reject when payload is invalid', async () => {
    const err = new Error('Invalid payload');
    mockedJwtVerify.mockImplementation((_, __, ___, cb) => cb(null, undefined));

    expect(jwtService.verify(token)).rejects.toThrow(err);
  });
});
