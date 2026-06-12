import { app } from '@/app/app';
import { StatusCodes } from '@/shared/constants';
import { faker } from '@faker-js/faker';
import { test } from '@tests/integration/fixtures';
import request from 'supertest';
import { assert, describe, expect, vi } from 'vitest';
import { StripePaymentProvider } from '../infrastructure/stripe-payment.provider';

const examplePayload = {
  returnUrl: 'https://example.com',
};

describe('POST /subscriptions/customer-portal-sessions', () => {
  test('returns url to manage subscriptions', async ({ dbUser, dbPaymentProfile }) => {
    assert(dbPaymentProfile, 'Fix no-unused-vars. Payment profile is required');

    const mockUrl = faker.internet.url();

    const spy = vi
      // TODO: add test for existing customer
      .spyOn(StripePaymentProvider.prototype, 'createStripePortalSession')
      .mockResolvedValue(mockUrl);

    const res = await request(app)
      .post('/api/v1/subscriptions/customer-portal-sessions')
      .send(examplePayload)
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.CREATED);

    expect(spy).toHaveBeenCalled();
    expect(res.body.data.url).toBe(mockUrl);

    spy.mockRestore();
  });

  test('returns error when user has no payment profile', async ({ dbUser }) => {
    const res = await request(app)
      .post('/api/v1/subscriptions/customer-portal-sessions')
      .send(examplePayload)
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.NOT_FOUND);
    expect(res.body.error.code).toBe('PAYMENT_PROFILE_NOT_FOUND');
  });

  test('returns validation error for invalid request body', async ({ dbUser }) => {
    const res = await request(app)
      .post('/api/v1/subscriptions/customer-portal-sessions')
      .send({ returnUrl: 'not-a-url' })
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toEqual(expect.any(String));
    expect(res.body.error.details).toHaveLength(1);
  });

  test('unauthenticated request returns UNAUTHORIZED', async () => {
    const res = await request(app)
      .post('/api/v1/subscriptions/customer-portal-sessions')
      .send(examplePayload);

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
