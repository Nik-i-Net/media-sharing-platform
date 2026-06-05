import { app } from '@/app/app';
import { StatusCodes } from '@/shared/constants';
import request from 'supertest';
import { assert, describe, expect } from 'vitest';
import { test } from '../fixtures';

describe('GET /uploads', () => {
  test('authenticated user can list their uploads', async ({ dbUser, dbUploads }) => {
    const res = await request(app)
      .get(`/api/v1/uploads?limit=${dbUploads.length}`)
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.data.length).toBe(dbUploads.length);
  });

  test('supports pagination', async ({ dbUser, dbUploads }) => {
    assert(dbUploads.length > 2);
    const dbTotalItems = dbUploads.length;
    const page = 2;
    const limit = 2;

    const res = await request(app)
      .get(`/api/v1/uploads?page=${page}&limit=${limit}`)
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.data.length).toBe(limit);
    expect(res.body.meta).toMatchObject({
      page,
      limit,
      totalItems: dbTotalItems,
      totalPages: Math.ceil(dbTotalItems / limit),
    });
  });

  test('unauthenticated request returns UNAUTHORIZED', async () => {
    const res = await request(app).get(`/api/v1/uploads`);

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
