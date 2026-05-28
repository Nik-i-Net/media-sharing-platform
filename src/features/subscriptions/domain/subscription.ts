import { TodoError } from '@/shared/errors';

interface CreateSubscriptionParams {
  id: string;
  userId: string;
  planId: 'pro';
  provider: 'stripe';
  providerSubscriptionId: string;
  createdAt: Date;
  expiresAt: Date;
}

export class Subscription {
  static create(params: CreateSubscriptionParams) {
    const status = 'active';
    const updatedAt = params.createdAt;
    const subscription = new Subscription(
      params.id,
      params.userId,
      params.planId,
      params.provider,
      params.providerSubscriptionId,
      status,
      params.expiresAt,
      params.createdAt,
      updatedAt,
    );
    return subscription;
  }

  #status: 'active' | 'canceled';
  #expiresAt: Date;
  #updatedAt: Date;

  constructor(
    readonly id: string,
    readonly userId: string,
    readonly planId: 'pro',
    readonly provider: 'stripe',
    readonly providerSubscriptionId: string,
    status: 'active' | 'canceled',
    expiresAt: Date,
    readonly createdAt: Date,
    updatedAt: Date,
  ) {
    this.#status = status;
    this.#expiresAt = expiresAt;
    this.#updatedAt = updatedAt;
  }

  get status() {
    return this.#status;
  }
  get expiresAt() {
    return this.#expiresAt;
  }
  get updatedAt() {
    return this.#updatedAt;
  }

  isActive() {
    return this.#status === 'active';
  }

  setExpiresAt(expiresAt: Date) {
    if (!this.isActive()) throw new TodoError('Subscription is not active');
    if (expiresAt < new Date()) throw new TodoError('Cannot set expiresAt in the past');
    this.#expiresAt = expiresAt;
    this.touch();
  }

  cancel() {
    if (!this.isActive()) throw new TodoError('Subscription is not active');
    this.#status = 'canceled';
    this.touch();
  }

  private touch() {
    this.#updatedAt = new Date();
  }
}
