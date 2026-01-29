// import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';

type Hash = string;

export interface HashService {
  hash(plainText: string): Promise<Hash>;
  verify(plainText: string, hash: Hash): Promise<boolean>;
}

// export class BcryptHashService implements HashService {
//   constructor(private saltRounds: number = 10) {}
//
//   async hash(plainText: string): Promise<Hash> {
//     return bcrypt.hash(plainText, this.saltRounds);
//   }
//
//   async verify(plainText: string, hash: Hash): Promise<boolean> {
//     return bcrypt.compare(plainText, hash);
//   }
// }

export class Argon2HashService implements HashService {
  async hash(plainText: string): Promise<Hash> {
    return argon2.hash(plainText);
  }

  async verify(plainText: string, hash: Hash): Promise<boolean> {
    return argon2.verify(hash, plainText);
  }
}
