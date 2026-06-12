import type { SubscriptionsRepository } from '../domain/subscriptions.repository';
import { SubscriptionNotFoundError } from '../errors/subscription-not-found.error';

export interface HandleSubscriptionUpdatedCommand {
  subscriptionId: string;
  expiresAt: Date;
}

export class HandleSubscriptionUpdatedCommandHandler {
  constructor(private readonly subscriptionsRepo: SubscriptionsRepository) {}

  async execute(cmd: HandleSubscriptionUpdatedCommand): Promise<void> {
    const subscription = await this.subscriptionsRepo.findByProviderSubscriptionId(
      cmd.subscriptionId,
    );
    if (!subscription) throw new SubscriptionNotFoundError();

    subscription.setExpiresAt(cmd.expiresAt);

    await this.subscriptionsRepo.save(subscription);
  }
}
