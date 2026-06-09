import type Stripe from 'stripe';
import type {
  PaymentProvider,
  StripePortalSessionProps,
  SubscriptionCheckoutExistingCustomerParams,
  SubscriptionCheckoutNewCustomerParams,
} from '../application/ports/payment.provider';
import { TodoError } from '@/shared/errors';

export class StripePaymentProvider implements PaymentProvider {
  constructor(
    private readonly stripeClient: Stripe,
    private readonly proPlanPriceId: string,
  ) {}

  async createSubscriptionCheckoutSessionForNewCustomer(
    props: SubscriptionCheckoutNewCustomerParams,
  ): Promise<string> {
    const session = await this.stripeClient.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: this.proPlanPriceId, quantity: 1 }],
      success_url: props.successUrl,
      cancel_url: props.cancelUrl,

      ...(props.userEmail && { customer_email: props.userEmail }),

      subscription_data: {
        metadata: {
          userId: props.userId,
          planId: props.planId,
        },
      },
    });

    if (session.url === null) {
      throw new TodoError('Stripe checkout session creation failed');
    }

    return session.url;
  }

  async createSubscriptionCheckoutSessionForExistingCustomer(
    props: SubscriptionCheckoutExistingCustomerParams,
  ): Promise<string> {
    const session = await this.stripeClient.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: this.proPlanPriceId, quantity: 1 }],

      customer: props.customerId,
      success_url: props.successUrl,
      cancel_url: props.cancelUrl,

      subscription_data: {
        metadata: {
          userId: props.userId,
          planId: props.planId,
        },
      },
    });

    if (session.url === null) {
      throw new TodoError('Stripe checkout session creation failed');
    }

    return session.url;
  }

  async createStripePortalSession(props: StripePortalSessionProps): Promise<string> {
    const portalSession = await this.stripeClient.billingPortal.sessions.create({
      customer: props.customerId,
      return_url: props.returnUrl,
    });

    return portalSession.url;
  }
}
