import { app } from '@/app/app';
import { StatusCodes } from '@/shared/constants';
import { paymentProfilesTable, subscriptionsTable } from '@/shared/db/drizzle/schema';
import { ENV } from '@/shared/env.loader';
import { test } from '@tests/integration/fixtures';
import { createHmac } from 'node:crypto';
import request from 'supertest';
import { describe, expect } from 'vitest';
import { eq } from 'drizzle-orm';
import { db } from '@/shared/db/drizzle/client';

describe('Webhook: Stripe', () => {
  test('customer.subscription.created: new customer', async ({
    dbUser,
    customerSubscriptionCreatedStripeEvent,
  }) => {
    const payload = customerSubscriptionCreatedStripeEvent();

    const res = await request(app)
      .post(`/api/v1/webhooks/stripe`)
      .set('stripe-signature', createStripeSignature(payload))
      .send(payload);

    expect(res.status).toBe(StatusCodes.NO_CONTENT);

    const billingProfile = await db.query.paymentProfilesTable.findFirst({
      where: eq(paymentProfilesTable.providerCustomerId, payload.data.object.customer),
    });
    expect(billingProfile).toBeDefined();
    expect(billingProfile?.userId).toBe(dbUser.id);

    const subscription = await db.query.subscriptionsTable.findFirst({
      where: eq(subscriptionsTable.providerSubscriptionId, payload.data.object.id),
    });
    expect(subscription).toBeDefined();
    expect(subscription?.userId).toBe(dbUser.id);
    expect(subscription?.status).toBe('active');
  });

  test('customer.subscription.created: existing customer', async ({
    dbUser,
    dbPaymentProfile,
    customerSubscriptionCreatedStripeEvent,
  }) => {
    const customerId = dbPaymentProfile.providerCustomerId;
    const payload = customerSubscriptionCreatedStripeEvent(customerId);

    const res = await request(app)
      .post(`/api/v1/webhooks/stripe`)
      .set('stripe-signature', createStripeSignature(payload))
      .send(payload);

    expect(res.status).toBe(StatusCodes.NO_CONTENT);

    const billingProfiles = await db.query.paymentProfilesTable.findMany({
      where: eq(paymentProfilesTable.userId, dbUser.id),
    });
    expect(billingProfiles).toHaveLength(1);

    const subscription = await db.query.subscriptionsTable.findFirst({
      where: eq(subscriptionsTable.providerSubscriptionId, payload.data.object.id),
    });
    expect(subscription).toBeDefined();
    expect(subscription?.userId).toBe(dbUser.id);
    expect(subscription?.status).toBe('active');
  });

  test('customer.subscription.updated: renewal', async ({
    customerSubscriptionUpdatedStripeEvent,
  }) => {
    const payload = customerSubscriptionUpdatedStripeEvent;

    const res = await request(app)
      .post(`/api/v1/webhooks/stripe`)
      .set('stripe-signature', createStripeSignature(payload))
      .send(payload);

    expect(res.status).toBe(StatusCodes.NO_CONTENT);

    const subscription = await db.query.subscriptionsTable.findFirst({
      where: eq(subscriptionsTable.providerSubscriptionId, payload.data.object.id),
    });
    expect(subscription).toBeDefined();
    expect(subscription!.status).toBe('active');

    const newExpiresAt = payload.data.object.items.data[0]!.current_period_end * 1000;
    expect(subscription!.expiresAt.getTime()).toBe(newExpiresAt);
  });

  test('customer.subscription.deleted', async ({ customerSubscriptionDeletedStripeEvent }) => {
    const payload = customerSubscriptionDeletedStripeEvent;

    const res = await request(app)
      .post(`/api/v1/webhooks/stripe`)
      .set('stripe-signature', createStripeSignature(payload))
      .send(payload);

    expect(res.status).toBe(StatusCodes.NO_CONTENT);

    const subscription = await db.query.subscriptionsTable.findFirst({
      where: eq(subscriptionsTable.providerSubscriptionId, payload.data.object.id),
    });
    expect(subscription).toBeDefined();
    expect(subscription!.status).toBe('canceled');
  });

  test('returns validation error for invalid request body', async () => {
    const invalidPayload = {
      id: 'evt_test',
      // missing many fields
    };

    const res = await request(app)
      .post(`/api/v1/webhooks/stripe`)
      .set('stripe-signature', createStripeSignature(invalidPayload))
      .send(invalidPayload);

    expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toEqual(expect.any(String));
    expect(res.body.error.details.length).toBeGreaterThan(0);
  });

  test('return STRIPE_WEBHOOK_SIGNATURE_ERROR for invalid signature', async () => {
    const res = await request(app)
      .post('/api/v1/webhooks/stripe')
      .set('stripe-signature', 'invalid-signature')
      .send({ id: 'evt_test' });

    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body.error.code).toBe('STRIPE_WEBHOOK_SIGNATURE_ERROR');
  });
});

function createStripeSignature(payload: object) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${JSON.stringify(payload)}`;
  const signature = createHmac('sha256', ENV.STRIPE_WEBHOOK_SECRET)
    .update(signedPayload, 'utf-8')
    .digest('hex');

  return `t=${timestamp},v1=${signature}`;
}
