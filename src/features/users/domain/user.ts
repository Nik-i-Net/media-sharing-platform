import { TodoError } from '@/shared/errors';
import { UserHasNoIdentityError } from '../errors/user-has-no-identity.error';

export interface Identity {
  provider: string;
  providerUserId: string;
}

interface UserProps {
  id: string;
  externalId: string;
  email: string | null;
  emailVerified: boolean;
  identities: Identity[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface RegisterUserProps {
  id: string;
  externalId: string;
  email: string | null;
  emailVerified: boolean;
  identity: Identity;
}

export class User {
  static register(props: RegisterUserProps) {
    return new User({
      id: props.id,
      externalId: props.externalId,
      email: props.email,
      emailVerified: props.emailVerified,
      identities: [props.identity],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }

  readonly id: string;
  readonly externalId: string;
  #email: string | null;
  #emailVerified: boolean;
  #identities: Identity[];
  readonly createdAt: Date;
  #updatedAt: Date;
  #deletedAt: Date | null;

  constructor(props: UserProps) {
    this.id = props.id;
    this.externalId = props.externalId;
    this.#email = props.email;
    this.#emailVerified = props.emailVerified;

    if (props.identities.length === 0) throw new UserHasNoIdentityError();
    this.#identities = props.identities;
    this.createdAt = props.createdAt;
    this.#updatedAt = props.updatedAt;
    this.#deletedAt = props.deletedAt;
  }

  get email() {
    return this.#email;
  }
  get emailVerified() {
    return this.#emailVerified;
  }
  get identities() {
    return this.#identities;
  }
  get updatedAt() {
    return this.#updatedAt;
  }
  get deletedAt() {
    return this.#deletedAt;
  }

  changeEmail(newEmail: string) {
    if (this.#email === newEmail) throw new TodoError('Email is already set');

    this.#email = newEmail;
    this.touch();
  }

  removeEmail() {
    this.#email = null;
    this.#emailVerified = false;
    this.touch();
  }

  verifyEmail() {
    if (this.#email === null) throw new TodoError('Email is not set');
    if (this.#emailVerified) throw new TodoError('Email is already verified');

    this.#emailVerified = true;
    this.touch();
  }

  addIdentity(newIdentity: Identity) {
    this.#identities.forEach((identity) => {
      if (identity.provider === newIdentity.provider)
        throw new TodoError('Cannot add identity with same provider');
    });

    this.#identities.push(newIdentity);
    this.touch();
  }

  removeIdentity({ provider, providerUserId }: Identity) {
    if (this.#identities.length === 1) throw new TodoError('Cannot remove last identity');

    const idx = this.#identities.findIndex(
      (i) => i.provider === provider && i.providerUserId === providerUserId,
    );
    if (idx === -1) throw new TodoError('Identity not found');

    this.#identities.splice(idx, 1);
    this.touch();
  }

  suspendAccount() {
    this.#deletedAt = new Date();
    this.touch();
  }

  private touch() {
    this.#updatedAt = new Date();
  }
}
