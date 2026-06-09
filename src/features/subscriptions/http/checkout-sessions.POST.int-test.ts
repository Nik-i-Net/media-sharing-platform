import { app } from '@/app/app';
import { StatusCodes } from '@/shared/constants';
import { faker } from '@faker-js/faker';
import { test } from '@tests/integration/fixtures';
import request from 'supertest';
import { assert, describe, expect, vi } from 'vitest';
import { StripePaymentProvider } from '../infrastructure/stripe-payment.provider';

const examplePayload = {
  successUrl: 'https://example.com/success',
  cancelUrl: 'https://example.com/cancel',
};

describe('POST /subscriptions/checkout-sessions', () => {
  test('authenticated user can create checkout session', async ({ dbUser }) => {
    const mockUrl = faker.internet.url();

    const spy = vi
      // TODO: add test for existing customer
      .spyOn(StripePaymentProvider.prototype, 'createSubscriptionCheckoutSessionForNewCustomer')
      .mockResolvedValue(mockUrl);

    const res = await request(app)
      .post('/api/v1/subscriptions/checkout-sessions')
      .send(examplePayload)
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.CREATED);

    expect(spy).toHaveBeenCalled();
    expect(res.body.data.url).toBe(mockUrl);

    spy.mockRestore();
  });

  test('user with active subscription cannot create checkout session', async ({
    dbUser,
    dbActiveSubscription,
  }) => {
    assert(dbActiveSubscription, 'Fix no-unused-vars. Active subscription is required');

    const res = await request(app)
      .post('/api/v1/subscriptions/checkout-sessions')
      .send(examplePayload)
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.CONFLICT);
    expect(res.body.error.code).toBe('ACTIVE_SUBSCRIPTION_EXISTS');
  });

  test('returns validation error for invalid request body', async ({ dbUser }) => {
    const res = await request(app)
      .post('/api/v1/subscriptions/checkout-sessions')
      .send({ successUrl: 1, cancelUrl: 'not-a-url' })
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toEqual(expect.any(String));
    expect(res.body.error.details).toHaveLength(2);
  });

  test('unauthenticated request returns UNAUTHORIZED', async () => {
    const res = await request(app)
      .post('/api/v1/subscriptions/checkout-sessions')
      .send(examplePayload);

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
