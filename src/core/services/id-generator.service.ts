import { customAlphabet } from 'nanoid';

export class IdGeneratorService {
  private readonly nanoid: () => string;

  constructor() {
    const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.nanoid = customAlphabet(alphabet, 12);
  }

  generateUuid() {
    return crypto.randomUUID();
  }

  generateNanoId() {
    return this.nanoid();
  }
}
