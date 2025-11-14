import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { loadJwtKeys } from '@src/shared/jwt/jwt.load-keys.js';
import fs from 'node:fs';

jest.mock('node:fs');
const mockedFs = jest.mocked(fs);

const privateKeyPath = 'private.pem';
const publicKeyPath = 'public.pem';

const privateKey = 'test-private-key';
const publicKey = 'test-public-key';

const mockedReadFileSync = ((path: string) => {
  if (path === privateKeyPath) return privateKey;
  if (path === publicKeyPath) return publicKey;
  throw new Error('ENOENT: no such file or directory');
}) as typeof fs.readFileSync;

mockedFs.readFileSync.mockImplementation(mockedReadFileSync);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('loadJwtKeys', () => {
  test('should call fs.readFileSync twice with "utf-8" encoding', () => {
    loadJwtKeys(privateKeyPath, publicKeyPath);

    expect(mockedFs.readFileSync).toHaveBeenCalledTimes(2);
    expect(mockedFs.readFileSync).toHaveBeenNthCalledWith(1, privateKeyPath, 'utf-8');
    expect(mockedFs.readFileSync).toHaveBeenNthCalledWith(2, publicKeyPath, 'utf-8');
  });

  test('should load keys successfully', () => {
    const keys = loadJwtKeys(privateKeyPath, publicKeyPath);

    expect(keys.privateKey).toContain(privateKey);
    expect(keys.publicKey).toContain(publicKey);
  });

  test('should throw error if paths are missing', () => {
    const errMessage = 'JWT privateKeyPath or publicKeyPath is missing';

    expect(() => loadJwtKeys(undefined, publicKeyPath)).toThrow(errMessage);
    expect(() => loadJwtKeys(privateKeyPath, undefined)).toThrow(errMessage);
    expect(() => loadJwtKeys(undefined, undefined)).toThrow(errMessage);
  });

  test('should throw error if files do not exist', () => {
    const nonExistentPath = 'nonexistent.pem';
    const errMessage = 'Failed to load JWT keys:';

    expect(() => loadJwtKeys(nonExistentPath, publicKeyPath)).toThrow(errMessage);
    expect(() => loadJwtKeys(privateKeyPath, nonExistentPath)).toThrow(errMessage);
    expect(() => loadJwtKeys(nonExistentPath, nonExistentPath)).toThrow(errMessage);
  });
});
