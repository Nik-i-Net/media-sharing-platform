export class HashVO {
  static fromHex(hex: string) {
    return new HashVO(Buffer.from(hex, 'hex'));
  }

  constructor(readonly value: Buffer) {}

  get base64() {
    return this.value.toString('base64');
  }
  get hex() {
    return this.value.toString('hex');
  }
}
