import { TodoError } from '@/shared/errors';
import { Plan } from './plan';
import { duration, type Duration } from '@/shared/utils';

export interface Identity {
  provider: string;
  userId: string;
}

interface UserProps {
  id: string;
  externalId: string;
  email: string | null;
  emailVerified: boolean;
  identities: Identity[];
  totalStorageBytes: number;
  plan: Plan;
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
  plan: Plan;
}

export class User {
  static register(props: RegisterUserProps) {
    return new User({
      id: props.id,
      externalId: props.externalId,
      email: props.email,
      emailVerified: props.emailVerified,
      identities: [props.identity],
      totalStorageBytes: 0,
      plan: props.plan,
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
  #totalStorageBytes: number;
  #plan: Plan;
  readonly createdAt: Date;
  #updatedAt: Date;
  #deletedAt: Date | null;

  constructor(props: UserProps) {
    this.id = props.id;
    this.externalId = props.externalId;
    this.#email = props.email;
    this.#emailVerified = props.emailVerified;

    if (props.identities.length === 0) throw new TodoError('User must have at least one identity');
    this.#identities = props.identities;
    this.#totalStorageBytes = props.totalStorageBytes;
    this.#plan = props.plan;
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
  get totalStorageBytes() {
    return this.#totalStorageBytes;
  }
  get plan() {
    return this.#plan;
  }
  get updatedAt() {
    return this.#updatedAt;
  }
  get deletedAt() {
    return this.#deletedAt;
  }

  changeEmail(newEmail: string) {
    if (!newEmail.includes('@')) throw new TodoError('Invalid email');
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

  removeIdentity({ provider, userId }: Identity) {
    if (this.#identities.length === 1) throw new TodoError('Cannot remove last identity');

    const idx = this.#identities.findIndex((i) => i.provider === provider && i.userId === userId);
    if (idx === -1) throw new TodoError('Identity not found');

    this.#identities.splice(idx, 1);
    this.touch();
  }

  changePlan(newPlan: Plan) {
    if (this.#plan.id === newPlan.id) throw new TodoError('Plan is already set');

    this.#plan = newPlan;
    this.touch();
  }

  ensureCanUpload(
    files: { id: string; mimeType: string; sizeBytes: number; ttl: Duration | null }[],
  ) {
    let totalBytes = 0;

    files.forEach(({ id, mimeType, sizeBytes, ttl }) => {
      if (!this.#plan.allowedMimeTypes.includes(mimeType)) {
        throw new TodoError(`Mime type ${mimeType} not allowed. Id: ${id}`);
      }

      if (ttl !== null && (duration(ttl).lt('1h') || duration(ttl).gt('30d'))) {
        throw new TodoError(`TTL ${ttl} not allowed. Id: ${id}`);
      }

      totalBytes += sizeBytes;
    });

    if (totalBytes > this.#plan.maxFileSizeBytes) {
      throw new TodoError('Not enough storage space');
    }
  }

  suspendAccount() {
    this.#deletedAt = new Date();
    this.touch();
  }

  private touch() {
    this.#updatedAt = new Date();
  }
}
