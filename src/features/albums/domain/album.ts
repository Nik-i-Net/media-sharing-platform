export class Album {
  public static create(id: string, userId: string, name: string) {
    const isPublic = false;
    const now = new Date();
    const album = new Album(id, userId, name, isPublic, now, now);
    return album;
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
    this.touch();
  }

  setPublic(isPublic: boolean = true) {
    this.#isPublic = isPublic;
    this.touch();
  }

  private touch() {
    this.#updatedAt = new Date();
  }
}
