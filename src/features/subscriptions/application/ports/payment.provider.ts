export interface PaymentProvider {
  createSubscriptionCheckoutSessionForNewCustomer(
    props: SubscriptionCheckoutNewCustomerParams,
  ): Promise<string>;

  createSubscriptionCheckoutSessionForExistingCustomer(
    props: SubscriptionCheckoutExistingCustomerParams,
  ): Promise<string>;

  createStripePortalSession(props: StripePortalSessionProps): Promise<string>;
}

export interface SubscriptionCheckoutNewCustomerParams {
  userId: string;
  planId: 'pro';
  userEmail?: string | undefined;
  successUrl?: string | undefined;
  cancelUrl?: string | undefined;
}

export interface SubscriptionCheckoutExistingCustomerParams {
  userId: string;
  planId: 'pro';
  customerId: string;
  successUrl?: string | undefined;
  cancelUrl?: string | undefined;
}

export interface StripePortalSessionProps {
  customerId: string;
  returnUrl?: string | undefined;
}
