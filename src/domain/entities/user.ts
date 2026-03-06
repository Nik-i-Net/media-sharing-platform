export class User {
  public static register(id: string, username: string, email: string, passwordHash: string) {
    const emailVerified = false;
    const now = new Date();
    const user = new User(id, username, email, emailVerified, passwordHash, now, now);
    return user;
  }

  #username: string;
  #email: string;
  #emailVerified: boolean;
  #passwordHash: string;
  #updatedAt: Date;

  constructor(
    readonly id: string,
    username: string,
    email: string,
    emailVerified: boolean,
    passwordHash: string,
    readonly createdAt: Date,
    updatedAt: Date,
  ) {
    this.#username = username;
    this.#email = email;
    this.#emailVerified = emailVerified;
    this.#passwordHash = passwordHash;
    this.#updatedAt = updatedAt;
  }

  get username() {
    return this.#username;
  }
  get email() {
    return this.#email;
  }
  get emailVerified() {
    return this.#emailVerified;
  }
  get updatedAt() {
    return this.#updatedAt;
  }
  get passwordHash() {
    return this.#passwordHash;
  }

  changeUsername(newName: string) {
    this.#username = newName;
    this.#touch();
  }

  changeEmail(newEmail: string) {
    this.#email = newEmail;
    this.#touch();
  }

  verifyEmail() {
    this.#emailVerified = true;
    this.#touch();
  }

  changePasswordHash(newHash: string) {
    this.#passwordHash = newHash;
    this.#touch();
  }

  #touch() {
    this.#updatedAt = new Date();
  }
}
