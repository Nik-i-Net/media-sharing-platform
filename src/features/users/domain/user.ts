interface RegisterUserProps {
  id: string;
  email?: string | undefined;
  emailVerified?: boolean | undefined;
}

interface NewUserProps {
  id: string;
  email: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  static register(props: RegisterUserProps) {
    const user = new User({
      id: props.id,
      email: props.email ?? null,
      emailVerified: props.emailVerified ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return user;
  }

  readonly id: string;
  private _email: string | null;
  private _emailVerified: boolean;
  readonly createdAt: Date;
  private _updatedAt: Date;

  constructor(props: NewUserProps) {
    this.id = props.id;
    this._email = props.email;
    this._emailVerified = props.emailVerified;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
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

  changeEmail(newEmail: string) {
    this._email = newEmail;
    this.touch();
  }

  verifyEmail() {
    this._emailVerified = true;
    this.touch();
  }

  private touch() {
    this._updatedAt = new Date();
  }
}
