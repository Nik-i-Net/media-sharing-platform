import { app } from '@/app/app';
import { StatusCodes } from '@/shared/constants';
import { db } from '@/shared/db/drizzle/client';
import { albumsTable } from '@/shared/db/drizzle/schema';
import { eq } from 'drizzle-orm';
import request from 'supertest';
import { assert, describe, expect } from 'vitest';
import { test } from '../fixtures';

describe('DELETE /albums/:id', () => {
  test('authenticated user can delete their own album', async ({ dbUser, dbAlbums }) => {
    const firstAlbum = dbAlbums[0]!;
    assert(dbUser.id === firstAlbum.userId);

    const res = await request(app)
      .delete(`/api/v1/albums/${firstAlbum.id}`)
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.NO_CONTENT);

    const fetchedAlbum = await db.query.albumsTable.findFirst({
      where: eq(albumsTable.id, firstAlbum.id),
    });
    expect(fetchedAlbum).toBeUndefined();
  });

  test('users cannot delete albums they do not own', async ({ dbUser }) => {
    const res = await request(app)
      .delete(`/api/v1/albums/${crypto.randomUUID()}`)
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.FORBIDDEN);
    expect(res.body.error.code).toBe('ALBUM_ACCESS_DENIED');
  });

  test('unauthenticated request returns UNAUTHORIZED', async () => {
    const res = await request(app).delete(`/api/v1/albums/${crypto.randomUUID()}`);

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
