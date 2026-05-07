interface CreateBlobParams {
  storageKey: string;
  hash: string;
  mimeType: string;
  sizeBytes: number;
}

export class BlobEntity {
  public static create(props: CreateBlobParams) {
    const { storageKey, hash, mimeType, sizeBytes } = props;
    const id = null;
    const hashAlgorithm = 'sha256base64';
    const now = new Date();
    const blob = new BlobEntity(id, storageKey, hash, hashAlgorithm, mimeType, sizeBytes, now, now);
    return blob;
  }

  constructor(
    readonly id: number | null,
    readonly storageKey: string,
    readonly hash: string,
    readonly hashAlgorithm: string,
    readonly mimeType: string,
    readonly sizeBytes: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
