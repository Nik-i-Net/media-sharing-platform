import type { UsersRepository } from '@/features/users/domain/users.repository';
import type { PaymentProfilesRepository } from '../domain/payment-profiles.repository';
import type { SubscriptionsRepository } from '../domain/subscriptions.repository';
import { ActiveSubscriptionExistsError } from '../errors/active-subscription-exists.error';
import type { PaymentProvider } from './ports/payment.provider';

export type CreateSubscriptionCheckoutUrlCommand = {
  userId: string;
  successUrl?: string | undefined;
  cancelUrl?: string | undefined;
};

export class CreateSubscriptionCheckoutUrlCommandHandler {
  constructor(
    private readonly subscriptionsRepo: SubscriptionsRepository,
    private readonly paymentProfilesRepo: PaymentProfilesRepository,
    private readonly usersRepo: UsersRepository,
    private readonly paymentProvider: PaymentProvider,
  ) {}

  async execute(cmd: CreateSubscriptionCheckoutUrlCommand): Promise<string> {
    const activeSubscriptions = await this.subscriptionsRepo.findActiveByUserId(cmd.userId);
    if (activeSubscriptions.length > 0) {
      throw new ActiveSubscriptionExistsError();
    }

    const paymentProfile = await this.paymentProfilesRepo.findByUserId(cmd.userId);
    let checkoutUrl: string;

    if (paymentProfile) {
      checkoutUrl = await this.paymentProvider.createSubscriptionCheckoutSessionForExistingCustomer(
        {
          userId: cmd.userId,
          planId: 'pro',
          customerId: paymentProfile.providerCustomerId,
          successUrl: cmd.successUrl,
          cancelUrl: cmd.cancelUrl,
        },
      );
    } else {
      checkoutUrl = await this.paymentProvider.createSubscriptionCheckoutSessionForNewCustomer({
        userId: cmd.userId,
        planId: 'pro',
        userEmail: (await this.usersRepo.findEmailById(cmd.userId)) ?? undefined,
        successUrl: cmd.successUrl,
        cancelUrl: cmd.cancelUrl,
      });
    }

    return checkoutUrl;
  }
}
