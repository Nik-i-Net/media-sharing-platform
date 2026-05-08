interface CreateMediaProps {
  id: string;
  userId: string;
  blobId: string;
  fileName: string;
  expiresAt: Date | null;
}

export class Media {
  static create(props: CreateMediaProps) {
    const { id, userId, blobId, fileName: fileName, expiresAt } = props;
    const now = new Date();
    const media = new Media(id, userId, blobId, fileName, expiresAt, now, now);
    return media;
  }

  #fileName: string;
  #expiresAt: Date | null;
  #updatedAt: Date;

  constructor(
    readonly id: string,
    readonly userId: string,
    readonly blobId: string,
    fileName: string,
    expiresAt: Date | null,
    readonly createdAt: Date,
    updatedAt: Date,
  ) {
    this.#fileName = fileName;
    this.#expiresAt = expiresAt;
    this.#updatedAt = updatedAt;
  }

  get fileName() {
    return this.#fileName;
  }
  get expiresAt() {
    return this.#expiresAt;
  }
  get updatedAt() {
    return this.#updatedAt;
  }

  changeFileName(newFileName: string) {
    this.#fileName = newFileName;
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
