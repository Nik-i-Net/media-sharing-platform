interface IdentityProps {
  id: string;
  provider: string;
  providerUserId: string;
  email: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
type RegisterIdentityProps = Omit<IdentityProps, 'createdAt' | 'updatedAt'>;

export class Identity {
  static register(props: RegisterIdentityProps) {
    return new Identity({
      id: props.id,
      provider: props.provider,
      providerUserId: props.providerUserId,
      email: props.email,
      emailVerified: props.emailVerified,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  readonly id: string;
  readonly provider: string;
  readonly providerUserId: string;
  #email: string | null;
  #emailVerified: boolean;
  readonly createdAt: Date;
  #updatedAt: Date;

  constructor(props: IdentityProps) {
    this.id = props.id;
    this.provider = props.provider;
    this.providerUserId = props.providerUserId;
    this.#email = props.email;
    this.#emailVerified = props.emailVerified;
    this.createdAt = props.createdAt;
    this.#updatedAt = props.updatedAt;
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

  changeEmail(newEmail: string) {
    this.#email = newEmail;
    this.touch();
  }

  verifyEmail() {
    this.#emailVerified = true;
    this.touch();
  }

  private touch() {
    this.#updatedAt = new Date();
  }
}
