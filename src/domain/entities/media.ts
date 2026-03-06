interface CreateMediaProps {
  id: string;
  userId: string | null;
  blobId: number;
  filename: string;
  expiresAt: Date | null;
}

export class Media {
  static create(props: CreateMediaProps) {
    const { id, userId, blobId, filename, expiresAt } = props;
    const now = new Date();
    const media = new Media(id, userId, blobId, filename, expiresAt, now, now);
    return media;
  }

  #filename: string;
  #expiresAt: Date | null;
  #updatedAt: Date | null;

  constructor(
    readonly id: string,
    readonly userId: string | null,
    readonly blobId: number,
    filename: string,
    expiresAt: Date | null,
    readonly createdAt: Date,
    updatedAt: Date,
  ) {
    this.#filename = filename;
    this.#expiresAt = expiresAt;
    this.#updatedAt = updatedAt;
  }

  get filename() {
    return this.#filename;
  }
  get expiresAt() {
    return this.#expiresAt;
  }
  get updatedAt() {
    return this.#updatedAt;
  }

  changeFilename(newFilename: string) {
    this.#filename = newFilename;
    this.#touch();
  }

  changeExpiresAt(newExpiresAt: Date | null) {
    if (newExpiresAt !== null && newExpiresAt < new Date()) {
      throw new Error('expiresAt must be in the future');
    }
    this.#expiresAt = newExpiresAt;
    this.#touch();
  }

  #touch() {
    this.#updatedAt = new Date();
  }
}
