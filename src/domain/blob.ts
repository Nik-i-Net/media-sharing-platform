export class BlobEntity {
  constructor(
    readonly id: number | null,
    readonly storageKey: string,
    readonly hash: string,
    readonly hashAlgorithm: string,
    readonly mimeType: string,
    readonly size: number,
    readonly createdAt: Date,
  ) {}

  public static create(storageKey: string, hash: string, mimeType: string, size: number) {
    const id = null;
    const hashAlgorithm = 'sha256base64';
    const createdAt = new Date();
    const blob = new BlobEntity(id, storageKey, hash, hashAlgorithm, mimeType, size, createdAt);
    return blob;
  }
}
