export class User {
  static register(id: string, username: string, email: string, passwordHash: string) {
    const emailVerified = false;
    const now = new Date();
    const user = new User(id, username, email, emailVerified, passwordHash, now, now);
    return user;
  }

  constructor(
    readonly id: string,
    private _username: string,
    private _email: string,
    private _emailVerified: boolean,
    private _passwordHash: string,
    readonly createdAt: Date,
    private _updatedAt: Date,
  ) {}

  get username() {
    return this._username;
  }
  get email() {
    return this._email;
  }
  get emailVerified() {
    return this._emailVerified;
  }
  get updatedAt() {
    return this._updatedAt;
  }
  get passwordHash() {
    return this._passwordHash;
  }

  changeUsername(newName: string) {
    this._username = newName;
    this.touch();
  }

  changeEmail(newEmail: string) {
    this._email = newEmail;
    this.touch();
  }

  verifyEmail() {
    this._emailVerified = true;
    this.touch();
  }

  changePasswordHash(newHash: string) {
    this._passwordHash = newHash;
    this.touch();
  }

  private touch() {
    this._updatedAt = new Date();
  }
}
