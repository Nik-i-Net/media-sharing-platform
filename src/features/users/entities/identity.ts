interface RegisterIdentityProps {
  id: string;
  userId: string;
  provider: string;
  providerUserId: string;
  email?: string | undefined;
  emailVerified?: boolean | undefined;
}

interface NewIdentityProps {
  id: string;
  userId: string;
  provider: string;
  providerUserId: string;
  email: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Identity {
  static register(props: RegisterIdentityProps) {
    const identity = new Identity({
      id: props.id,
      userId: props.userId,
      provider: props.provider,
      providerUserId: props.providerUserId,
      email: props.email ?? null,
      emailVerified: props.emailVerified ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return identity;
  }

  readonly id: string;
  readonly userId: string;
  readonly provider: string;
  readonly providerUserId: string;
  private _email: string | null;
  private _emailVerified: boolean;
  readonly createdAt: Date;
  private _updatedAt: Date;

  constructor(props: NewIdentityProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.provider = props.provider;
    this.providerUserId = props.providerUserId;
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
