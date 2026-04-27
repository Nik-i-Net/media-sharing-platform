import type { Identity } from './identity';

interface UserProps {
  id: string;
  email: string | null;
  emailVerified: boolean;
  totalStorageBytes: number;
  createdAt: Date;
  updatedAt: Date;
}
type RegisterUserProps = Pick<UserProps, 'id' | 'email' | 'emailVerified'>;

export class User {
  readonly id: string;
  #email: string | null;
  #emailVerified: boolean;
  #totalStorageBytes: number;
  readonly createdAt: Date;
  #updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.#email = props.email;
    this.#emailVerified = props.emailVerified;
    this.#totalStorageBytes = props.totalStorageBytes;
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
  get totalStorageBytes() {
    return this.#totalStorageBytes;
  }

  changeEmail(newEmail: string) {
    this.#email = newEmail;
    this.#updatedAt = new Date();
  }

  verifyEmail() {
    this.#emailVerified = true;
    this.#updatedAt = new Date();
  }
}

export class UserWithIdentities extends User {
  static register(props: RegisterUserProps) {
    return new UserWithIdentities({
      id: props.id,
      email: props.email,
      emailVerified: props.emailVerified,
      totalStorageBytes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      identities: [],
    });
  }

  #identities: Identity[];

  constructor(props: UserProps & { identities: Identity[] }) {
    const { identities, ...rest } = props;
    super(rest);
    this.#identities = identities;
  }

  get identities() {
    return this.#identities;
  }

  addIdentity(identity: Identity) {
    this.#identities.push(identity);
  }

  removeIdentity(id: string) {
    this.#identities = this.#identities.filter((i) => i.id !== id);
  }
}
