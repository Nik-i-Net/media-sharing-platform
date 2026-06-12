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
  successUrl: string;
  cancelUrl: string;
  userEmail?: string | undefined;
}

export interface SubscriptionCheckoutExistingCustomerParams {
  userId: string;
  planId: 'pro';
  customerId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface StripePortalSessionProps {
  customerId: string;
  returnUrl: string;
}
