import type { Subscription } from './subscription';

export interface SubscriptionsRepository {
  save(subscription: Subscription): Promise<void>;
  findByProviderSubscriptionId(id: string): Promise<Subscription | null>;
  findActiveByUserId(userId: string): Promise<Subscription[]>;
}
