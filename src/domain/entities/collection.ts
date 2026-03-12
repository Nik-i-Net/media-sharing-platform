export class Collection {
  public static create(id: string, userId: string, title: string) {
    const isPublic = false;
    const now = new Date();
    const collection = new Collection(id, userId, title, isPublic, now, now);
    return collection;
  }

  #title: string;
  #isPublic: boolean;
  #updatedAt: Date;

  constructor(
    readonly id: string,
    readonly userId: string,
    title: string,
    isPublic: boolean,
    readonly createdAt: Date,
    updatedAt: Date,
  ) {
    this.#title = title;
    this.#isPublic = isPublic;
    this.#updatedAt = updatedAt;
  }

  get title() {
    return this.#title;
  }
  get isPublic() {
    return this.#isPublic;
  }
  get updatedAt() {
    return this.#updatedAt;
  }

  changeTitle(newTitle: string) {
    this.#title = newTitle;
    this.#touch();
  }

  setPublic(isPublic: boolean = true) {
    this.#isPublic = isPublic;
    this.#touch();
  }

  #touch() {
    this.#updatedAt = new Date();
  }
}
