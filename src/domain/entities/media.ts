interface CreateMediaProps {
  id: string;
  userId: string | null;
  blobId: number;
  title: string;
  expiresAt: Date | null;
}

export class Media {
  static create(props: CreateMediaProps) {
    const { id, userId, blobId, title, expiresAt } = props;
    const now = new Date();
    const media = new Media(id, userId, blobId, title, expiresAt, now, now);
    return media;
  }

  #title: string;
  #expiresAt: Date | null;
  #updatedAt: Date;

  constructor(
    readonly id: string,
    readonly userId: string | null,
    readonly blobId: number,
    title: string,
    expiresAt: Date | null,
    readonly createdAt: Date,
    updatedAt: Date,
  ) {
    this.#title = title;
    this.#expiresAt = expiresAt;
    this.#updatedAt = updatedAt;
  }

  get title() {
    return this.#title;
  }
  get expiresAt() {
    return this.#expiresAt;
  }
  get updatedAt() {
    return this.#updatedAt;
  }

  changeTitle(newTitle: string) {
    this.#title = newTitle;
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
