import { TodoError } from '@/shared/errors';
import type { Identity } from './identity';
import assert from 'assert';

interface UserProps {
  id: string;
  email: string | null;
  emailVerified: boolean;
  totalStorageBytes: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  identities: Identity[];
}

interface RegisterUserProps {
  id: string;
  identity: Identity;
}

export class User {
  static register(props: RegisterUserProps) {
    return new User({
      id: props.id,
      email: props.identity.email,
      emailVerified: props.identity.emailVerified,
      totalStorageBytes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      identities: [props.identity],
    });
  }

  readonly id: string;
  #email: string | null;
  #emailVerified: boolean;
  #totalStorageBytes: number;
  readonly createdAt: Date;
  #updatedAt: Date;
  #deletedAt: Date | null;

  #identities: Identity[];
  _removedIdentityIds: string[] = [];

  constructor(props: UserProps) {
    this.id = props.id;
    this.#email = props.email;
    this.#emailVerified = props.emailVerified;
    this.#totalStorageBytes = props.totalStorageBytes;
    this.createdAt = props.createdAt;
    this.#updatedAt = props.updatedAt;
    this.#deletedAt = props.deletedAt;
    this.#identities = props.identities;
  }

  get email() {
    return this.#email;
  }
  get emailVerified() {
    return this.#emailVerified;
  }
  get totalStorageBytes() {
    return this.#totalStorageBytes;
  }
  get updatedAt() {
    return this.#updatedAt;
  }
  get deletedAt() {
    return this.#deletedAt;
  }
  get identities() {
    return this.#identities;
  }

  changeEmail(newEmail: string) {
    this.ensureNotSuspended();
    if (!newEmail.includes('@')) throw new TodoError('Invalid email');
    if (this.#email === newEmail) throw new TodoError('Email is already set');

    this.#email = newEmail;
    this.touch();
  }

  verifyEmail() {
    this.ensureNotSuspended();
    if (this.#email === null) throw new TodoError('Email is not set');
    if (this.#emailVerified) throw new TodoError('Email is already verified');

    this.#emailVerified = true;
    this.touch();
  }

  addIdentity(newIdentity: Identity) {
    this.ensureNotSuspended();
    assert(!this._removedIdentityIds.includes(newIdentity.id), 'Logic error');

    this.#identities.forEach((identity) => {
      if (identity.id === newIdentity.id) throw new TodoError('Identity already exists');
      if (identity.provider === newIdentity.provider)
        throw new TodoError('Cannot add identity with same provider');
    });

    this.#identities.push(newIdentity);
    this.touch();
  }

  removeIdentity(id: string) {
    this.ensureNotSuspended();
    if (this.#identities.length === 1) throw new TodoError('Cannot remove last identity');
    if (!this.#identities.some((i) => i.id === id)) throw new TodoError('Identity not found');

    this.#identities = this.#identities.filter((i) => i.id !== id);
    this._removedIdentityIds.push(id);
    this.touch();
  }

  suspendAccount() {
    this.#deletedAt = new Date();
    this.touch();
  }

  recoverAccount() {
    this.#deletedAt = null;
    this.touch();
  }

  private touch() {
    this.#updatedAt = new Date();
  }

  private ensureNotSuspended() {
    if (this.#deletedAt !== null) {
      throw new TodoError('Account is suspended');
    }
  }
}
