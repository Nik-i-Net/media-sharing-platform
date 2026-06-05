import { app } from '@/app/app';
import { ResponseSchema } from '@/features/albums/http/GET';
import { StatusCodes } from '@/shared/constants';
import request from 'supertest';
import { describe, expect } from 'vitest';
import { test } from '../fixtures';

describe('GET /albums', () => {
  test('authenticated user can list their albums', async ({ dbUser, dbAlbums }) => {
    const limit = dbAlbums.length - 1;

    const res = await request(app)
      .get(`/api/v1/albums?page=1&limit=${limit}`)
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    const { data, meta } = ResponseSchema.decode(res.body);
    const expectedAlbumIds = dbAlbums.slice(0, limit).map((a) => a.id);
    const receivedAlbumIds = data.map((a: { id: string }) => a.id);

    expect(res.status).toBe(200);
    expect(data.length).toBe(limit);
    expect(receivedAlbumIds).toEqual(expect.arrayContaining(expectedAlbumIds));
    expect(meta).toEqual({
      page: 1,
      limit,
      totalItems: dbAlbums.length,
      totalPages: 2,
    });
  });

  test('unauthenticated request returns UNAUTHORIZED', async () => {
    const res = await request(app).get(`/api/v1/albums?page=1&limit=10`);

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
