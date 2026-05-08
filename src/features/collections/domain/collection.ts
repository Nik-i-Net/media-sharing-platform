export class Collection {
  public static create(id: string, userId: string, name: string) {
    const isPublic = false;
    const now = new Date();
    const collection = new Collection(id, userId, name, isPublic, now, now);
    return collection;
  }

  #name: string;
  #isPublic: boolean;
  #updatedAt: Date;

  constructor(
    readonly id: string,
    readonly userId: string,
    name: string,
    isPublic: boolean,
    readonly createdAt: Date,
    updatedAt: Date,
  ) {
    this.#name = name;
    this.#isPublic = isPublic;
    this.#updatedAt = updatedAt;
  }

  get name() {
    return this.#name;
  }
  get isPublic() {
    return this.#isPublic;
  }
  get updatedAt() {
    return this.#updatedAt;
  }

  changeName(newName: string) {
    this.#name = newName;
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
