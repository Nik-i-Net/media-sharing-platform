import assert from 'assert';

export class HashVO {
  static fromHex(hex: string) {
    const hash = new HashVO(Buffer.from(hex, 'hex'));
    hash.#hex = hex;
    return hash;
  }

  #hex?: string;
  #base64?: string;

  constructor(readonly value: Buffer) {
    assert(Buffer.isBuffer(value));
  }

  get base64() {
    return (this.#base64 ??= this.value.toString('base64'));
  }
  get hex() {
    return (this.#hex ??= this.value.toString('hex'));
  }
}
