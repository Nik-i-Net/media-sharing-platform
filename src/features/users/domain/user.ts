import type { Identity } from './identity';

interface RegisterUserProps {
  id: string;
  email?: string | undefined;
  emailVerified?: boolean | undefined;
}

interface RestoreUserProps {
  id: string;
  email: string | null;
  emailVerified: boolean;
  totalStorageBytes: number;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  static register(props: RegisterUserProps) {
    const { id, email = null, emailVerified = null } = props;
    const totalStorageBytes = 0;
    const now = new Date();
    return new User(id, email, emailVerified, totalStorageBytes, now, now);
  }

  static restore(props: RestoreUserProps) {
    return new User(
      props.id,
      props.email,
      props.emailVerified,
      props.totalStorageBytes,
      props.createdAt,
      props.updatedAt,
    );
  }

  protected constructor(
    readonly id: string,
    private _email: string | null,
    private _emailVerified: boolean | null,
    private _totalStorageBytes: number,
    readonly createdAt: Date,
    protected _updatedAt: Date,
  ) {}

  get email() {
    return this._email;
  }
  get emailVerified() {
    return this._emailVerified;
  }
  get updatedAt() {
    return this._updatedAt;
  }
  get totalStorageBytes() {
    return this._totalStorageBytes;
  }

  changeEmail(newEmail: string) {
    this._email = newEmail;
    this._updatedAt = new Date();
  }

  verifyEmail() {
    this._emailVerified = true;
    this._updatedAt = new Date();
  }
}

interface RegisterUserWithIdentitiesProps extends RegisterUserProps {
  identities: Identity[];
}

interface RestoreUserWithIdentitiesProps extends RestoreUserProps {
  identities: Identity[];
}

export class UserWithIdentities extends User {
  static register(props: RegisterUserWithIdentitiesProps) {
    const { id, email = null, emailVerified = null, identities = [] } = props;
    const totalStorageBytes = 0;
    const now = new Date();
    return new UserWithIdentities(
      id,
      email,
      emailVerified,
      totalStorageBytes,
      now,
      now,
      identities,
    );
  }

  static restore(props: RestoreUserWithIdentitiesProps) {
    return new UserWithIdentities(
      props.id,
      props.email,
      props.emailVerified,
      props.totalStorageBytes,
      props.createdAt,
      props.updatedAt,
      props.identities,
    );
  }

  constructor(
    id: string,
    email: string | null,
    emailVerified: boolean | null,
    totalStorageBytes: number,
    createdAt: Date,
    updatedAt: Date,
    private _identities: Identity[],
  ) {
    super(id, email, emailVerified, totalStorageBytes, createdAt, updatedAt);
  }

  get identities() {
    return this._identities;
  }

  addIdentity(identity: Identity) {
    this._identities.push(identity);
    this._updatedAt = new Date();
  }
}
