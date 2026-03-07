export class Collection {
  public static create(id: string, userId: string, name: string) {
    const now = new Date();
    const collection = new Collection(id, userId, name, now, now);
    return collection;
  }

  #name: string;
  #updatedAt: Date;

  constructor(
    readonly id: string,
    readonly userId: string,
    name: string,
    readonly createdAt: Date,
    updatedAt: Date,
  ) {
    this.#name = name;
    this.#updatedAt = updatedAt;
  }

  get name() {
    return this.#name;
  }
  get updatedAt() {
    return this.#updatedAt;
  }

  changeName(newName: string) {
    this.#name = newName;
    this.#touch();
  }

  #touch() {
    this.#updatedAt = new Date();
  }
}
