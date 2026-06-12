import { app } from '@/app/app';
import { StatusCodes } from '@/shared/constants';
import { test } from '@tests/integration/fixtures';
import request from 'supertest';
import { assert, describe, expect } from 'vitest';

describe('GET /albums', () => {
  test('authenticated user can list their albums', async ({ dbUser, dbAlbums }) => {
    const res = await request(app)
      .get(`/api/v1/albums?limit=${dbAlbums.length}`)
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.data.length).toBe(dbAlbums.length);
  });

  test('supports pagination', async ({ dbUser, dbAlbums }) => {
    assert(dbAlbums.length > 2);
    const dbTotalItems = dbAlbums.length;
    const page = 2;
    const limit = 2;

    const res = await request(app)
      .get(`/api/v1/albums?page=${page}&limit=${limit}`)
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
    const res = await request(app).get(`/api/v1/albums?page=1&limit=10`);

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
