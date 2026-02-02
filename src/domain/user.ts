export class User {
  public readonly id: string;
  private _username: string;
  private _email: string;
  private _emailVerified: boolean;
  private _password: string;
  public readonly createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    username: string,
    email: string,
    emailVerified: boolean,
    password: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this._username = username;
    this._email = email;
    this._emailVerified = emailVerified;
    this._password = password;
    this.createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  public static register(username: string, email: string, password: string) {
    const id = crypto.randomUUID();
    const emailVerified = false;
    const now = new Date();
    const user = new User(id, username, email, emailVerified, password, now, now);
    return user;
  }

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
  get password() {
    return this._password;
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

  validatePassword(rawPassword: string, ctx: { username: string }) {
    const tooShort = rawPassword.length < 4;
    const noDigit = /\d/.test(rawPassword) === false;
    const includesName = rawPassword.includes(ctx.username);

    if (tooShort || noDigit || includesName) return false;
    return true;
  }

  changePassword(hash: string) {
    this._password = hash;
    this.touch();
  }

  private touch() {
    this._updatedAt = new Date();
  }
}
