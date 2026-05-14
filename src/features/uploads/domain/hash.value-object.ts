export class HashVO {
  static fromHex(hex: string) {
    return new HashVO(Buffer.from(hex, 'hex'));
  }

  #hex?: string;
  #base64?: string;

  constructor(readonly value: Buffer) {}

  get base64() {
    return (this.#base64 ??= this.value.toString('base64'));
  }
  get hex() {
    return (this.#hex ??= this.value.toString('hex'));
  }
}
