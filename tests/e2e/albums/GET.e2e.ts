import { app } from '@/app/app';
import { ResponseSchema } from '@/features/albums/http/GET';
import { StatusCodes } from '@/shared/constants';
import assert from 'node:assert';
import request from 'supertest';
import { describe, expect } from 'vitest';
import { test } from '../fixtures';

describe('GET /albums', () => {
  test('returns paginated list of albums for authenticated user', async ({ dbUser, dbAlbums }) => {
    assert(dbAlbums.length > 1);

    const limit = dbAlbums.length - 1;

    const res = await request(app)
      .get(`/api/v1/albums?page=1&limit=${limit}`)
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    const { data, meta } = ResponseSchema.decode(res.body);
    const expectedIds = dbAlbums.slice(0, limit).map((a) => a.id);
    const receivedIds = data.map((a: { id: string }) => a.id);

    expect(res.status).toBe(200);
    expect(data.length).toBe(limit);
    expect(receivedIds).toEqual(expect.arrayContaining(expectedIds));
    expect(meta).toEqual({
      page: 1,
      limit,
      totalItems: dbAlbums.length,
      totalPages: 2,
    });
  });

  test('returns Unauthorized when token is missing or invalid', async () => {
    const res = await request(app).get(`/api/v1/albums?page=1&limit=10`);

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
