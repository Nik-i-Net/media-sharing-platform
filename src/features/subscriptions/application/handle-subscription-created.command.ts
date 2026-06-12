import { PaymentProfile } from '../domain/payment-profile';
import type { PaymentProfilesRepository } from '../domain/payment-profiles.repository';
import { Subscription } from '../domain/subscription';
import type { SubscriptionsRepository } from '../domain/subscriptions.repository';

export interface HandleSubscriptionCreatedCommand {
  userId: string;
  planId: 'pro';
  subscriptionId: string;
  customerId: string;
  createdAt: Date;
  expiresAt: Date;
}

export class HandleSubscriptionCreatedCommandHandler {
  constructor(
    private readonly subscriptionsRepo: SubscriptionsRepository,
    private readonly paymentProfilesRepo: PaymentProfilesRepository,
  ) {}

  async execute(cmd: HandleSubscriptionCreatedCommand): Promise<void> {
    const paymentProfile = await this.paymentProfilesRepo.findByProviderCustomerId(cmd.customerId);
    if (!paymentProfile) {
      const newPaymentProfile = PaymentProfile.create({
        id: crypto.randomUUID(),
        userId: cmd.userId,
        provider: 'stripe',
        providerCustomerId: cmd.customerId,
      });

      await this.paymentProfilesRepo.save(newPaymentProfile);
    }

    const subscription = Subscription.create({
      id: crypto.randomUUID(),
      userId: cmd.userId,
      planId: cmd.planId,
      provider: 'stripe',
      providerSubscriptionId: cmd.subscriptionId,
      createdAt: cmd.createdAt,
      expiresAt: cmd.expiresAt,
    });

    await this.subscriptionsRepo.save(subscription);
  }
}
