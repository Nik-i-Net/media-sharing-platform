import { app } from '@/app/app';
import { StatusCodes } from '@/shared/constants';
import { db } from '@/shared/db/drizzle/client';
import { usersTable } from '@/shared/db/drizzle/schema';
import { ENV } from '@/shared/env.loader';
import { test } from '@tests/integration/fixtures';
import { eq } from 'drizzle-orm';
import request from 'supertest';
import { assert, describe, expect } from 'vitest';

describe('POST /users/auth0', () => {
  test('returns `userId` for existing user', async ({ dbUser, auth0ExistingUser }) => {
    const res = await request(app)
      .post(`/api/v1/users/auth0`)
      .send(auth0ExistingUser)
      .set('x-api-key', ENV.AUTH0_API_KEY);

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.data.userId).toBe(dbUser.id);
  });

  test('registers new user with unique email', async ({ auth0NewUser }) => {
    const res = await request(app)
      .post(`/api/v1/users/auth0`)
      .send(auth0NewUser)
      .set('x-api-key', ENV.AUTH0_API_KEY);

    expect(res.status).toBe(StatusCodes.OK);

    const fetchedUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, auth0NewUser.email),
    });

    assert(fetchedUser);
    expect(res.body.data.userId).toBe(fetchedUser.id);
  });

  test('rejects registration with already used email', async ({ dbUser, auth0NewUser }) => {
    const res = await request(app)
      .post(`/api/v1/users/auth0`)
      .send({ ...auth0NewUser, email: dbUser.email })
      .set('x-api-key', ENV.AUTH0_API_KEY);

    expect(res.status).toBe(StatusCodes.CONFLICT);
    expect(res.body.error.code).toBe('EMAIL_TAKEN');

    const fetchedUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, auth0NewUser.email),
    });

    expect(fetchedUser).toBeUndefined();
  });

  test('returns validation error for invalid request body', async () => {
    const payload = {
      userId: true, // 1. invalid format
      email: 'invalid-email', // 2. invalid format
      emailVerified: true,
      // 3. missing `identities`
    };

    const res = await request(app)
      .post(`/api/v1/users/auth0`)
      .send(payload)
      .set('x-api-key', ENV.AUTH0_API_KEY);

    expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toEqual(expect.any(String));
    expect(res.body.error.details).toHaveLength(3);
  });

  test('unauthenticated request returns UNAUTHORIZED', async ({ auth0NewUser }) => {
    const res = await request(app).post(`/api/v1/users/auth0`).send(auth0NewUser);

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
