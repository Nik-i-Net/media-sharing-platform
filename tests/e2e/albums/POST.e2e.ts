import { app } from '@/app/app';
import { StatusCodes } from '@/shared/constants';
import { db } from '@/shared/db/drizzle/client';
import { albumsTable, userCountersTable } from '@/shared/db/drizzle/schema';
import { eq } from 'drizzle-orm';
import request from 'supertest';
import { assert, describe, expect } from 'vitest';
import z from 'zod';
import { test } from '../fixtures';

describe('POST /albums', () => {
  test('authenticated user can create album', async ({ dbUser }) => {
    const fetchCountersQuery = db.query.userCountersTable.findFirst({
      where: eq(userCountersTable.userId, dbUser.id),
    });

    const countersBefore = await fetchCountersQuery.execute();
    const res = await request(app)
      .post(`/api/v1/albums`)
      .send({ name: 'test-album', isPublic: false })
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.CREATED);

    const createdAlbumId = z.uuid().parse(res.body.data.id);
    const fetchedAlbum = await db.query.albumsTable.findFirst({
      where: eq(albumsTable.id, createdAlbumId),
    });

    expect(fetchedAlbum).toMatchObject({
      userId: dbUser.id,
      name: 'test-album',
      isPublic: false,
    });

    const countersAfter = await fetchCountersQuery.execute();
    assert(countersBefore && countersAfter);
    expect(countersAfter.totalAlbums).toBe(countersBefore.totalAlbums + 1);
  });

  test('returns validation error for invalid album data', async ({ dbUser }) => {
    const res = await request(app)
      .post(`/api/v1/albums`)
      .send({ isPublic: 'true' })
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(res.body.error).toMatchObject({
      code: 'VALIDATION_ERROR',
      message: expect.any(String),
      details: expect.arrayContaining([
        expect.objectContaining({
          message: expect.any(String),
          code: expect.any(String),
          location: expect.any(String),
          path: expect.any(Array),
          value: expect.anything(),
        }),
      ]),
    });
  });

  test('unauthenticated request returns UNAUTHORIZED', async () => {
    const res = await request(app)
      .post(`/api/v1/albums`)
      .send({ name: 'test-album', isPublic: false });

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
