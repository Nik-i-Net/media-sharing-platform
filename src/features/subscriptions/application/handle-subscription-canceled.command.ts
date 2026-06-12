import type { SubscriptionsRepository } from '../domain/subscriptions.repository';
import { SubscriptionNotFoundError } from '../errors/subscription-not-found.error';

export class HandleSubscriptionCanceledCommandHandler {
  constructor(private readonly subscriptionsRepo: SubscriptionsRepository) {}

  async execute(subscriptionId: string): Promise<void> {
    const subscription = await this.subscriptionsRepo.findByProviderSubscriptionId(subscriptionId);
    if (!subscription) throw new SubscriptionNotFoundError();

    subscription.cancel();

    await this.subscriptionsRepo.save(subscription);
  }
}
