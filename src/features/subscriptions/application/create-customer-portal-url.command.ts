import type { PaymentProfilesRepository } from '../domain/payment-profiles.repository';
import { PaymentProfileNotFoundError } from '../errors/payment-profile-not-found.error';
import type { PaymentProvider } from './ports/payment.provider';

export type CreateCustomerPortalUrlCommand = {
  userId: string;
  returnUrl?: string | undefined;
};

export class CreateCustomerPortalUrlCommandHandler {
  constructor(
    private readonly paymentProfilesRepo: PaymentProfilesRepository,
    private readonly paymentProvider: PaymentProvider,
  ) {}

  async execute(cmd: CreateCustomerPortalUrlCommand): Promise<string> {
    const paymentProfile = await this.paymentProfilesRepo.findByUserId(cmd.userId);
    if (!paymentProfile) throw new PaymentProfileNotFoundError();

    const portalUrl = await this.paymentProvider.createStripePortalSession({
      customerId: paymentProfile.providerCustomerId,
      returnUrl: cmd.returnUrl,
    });

    return portalUrl;
  }
}
