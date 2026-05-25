interface CreateUploadProps {
  id: string;
  userId: string;
  blobId: string;
  fileName: string;
  isPublic: boolean;
  expiresAt: Date | null;
}

export class Upload {
  static create(props: CreateUploadProps) {
    const { id, userId, blobId, fileName: fileName, isPublic, expiresAt } = props;
    const now = new Date();
    const upload = new Upload(id, userId, blobId, fileName, isPublic, expiresAt, now, now);
    return upload;
  }

  #fileName: string;
  #isPublic: boolean;
  #expiresAt: Date | null;
  #updatedAt: Date;

  constructor(
    readonly id: string,
    readonly userId: string,
    readonly blobId: string,
    fileName: string,
    isPublic: boolean,
    expiresAt: Date | null,
    readonly createdAt: Date,
    updatedAt: Date,
  ) {
    this.#fileName = fileName;
    this.#isPublic = isPublic;
    this.#expiresAt = expiresAt;
    this.#updatedAt = updatedAt;
  }

  get fileName() {
    return this.#fileName;
  }
  get isPublic() {
    return this.#isPublic;
  }
  get expiresAt() {
    return this.#expiresAt;
  }
  get updatedAt() {
    return this.#updatedAt;
  }

  changeFileName(newFileName: string) {
    this.#fileName = newFileName;
    this.touch();
  }

  setPublic(isPublic: boolean = true) {
    this.#isPublic = isPublic;
    this.touch();
  }

  changeExpiresAt(newExpiresAt: Date | null) {
    if (newExpiresAt !== null && newExpiresAt < new Date()) {
      throw new Error('expiresAt must be in the future');
    }
    this.#expiresAt = newExpiresAt;
    this.touch();
  }

  private touch() {
    this.#updatedAt = new Date();
  }
}
