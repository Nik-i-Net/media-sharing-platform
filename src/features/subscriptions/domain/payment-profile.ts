interface CreatePaymentProfileParams {
  id: string;
  userId: string;
  provider: 'stripe';
  providerCustomerId: string;
}

export class PaymentProfile {
  static create(params: CreatePaymentProfileParams) {
    const { id, userId, provider, providerCustomerId } = params;
    const now = new Date();
    const profile = new PaymentProfile(id, userId, provider, providerCustomerId, now, now);
    return profile;
  }

  constructor(
    readonly id: string,
    readonly userId: string,
    readonly provider: 'stripe',
    readonly providerCustomerId: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
