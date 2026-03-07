import { customAlphabet } from 'nanoid';
import type { IdGeneratorService } from '../../application/ports/id-generator.service';

export class DefaultIdGeneratorService implements IdGeneratorService {
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
