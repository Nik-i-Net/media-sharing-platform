import * as argon2 from 'argon2';

export interface HashService {
  hash(rawPassword: string): Promise<string>;
  verify(rawPassword: string, hash: string): Promise<boolean>;
}

export class Argon2HashService implements HashService {
  async hash(rawPassword: string): Promise<string> {
    return argon2.hash(rawPassword);
  }

  async verify(rawPassword: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, rawPassword);
  }
}
