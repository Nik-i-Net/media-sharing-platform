import { app } from '@/app/app';
import { StatusCodes } from '@/shared/constants';
import { db } from '@/shared/db/drizzle/client';
import { albumsTable } from '@/shared/db/drizzle/schema';
import { eq } from 'drizzle-orm';
import request from 'supertest';
import { assert, describe, expect } from 'vitest';
import { test } from '../fixtures';

describe('PATCH /albums/:id', () => {
  test('owner can update album', async ({ dbUser, dbAlbums }) => {
    const firstAlbum = dbAlbums[0]!;
    assert(dbUser.id === firstAlbum.userId);
    const newName = 'new-name';

    const res = await request(app)
      .patch(`/api/v1/albums/${firstAlbum.id}`)
      .send({ name: newName })
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.NO_CONTENT);

    const fetchedAlbum = await db.query.albumsTable.findFirst({
      where: eq(albumsTable.id, firstAlbum.id),
    });
    expect(fetchedAlbum).toMatchObject({
      userId: dbUser.id,
      name: newName,
      isPublic: firstAlbum.isPublic,
    });
  });

  test('non-owner cannot update album', async ({ dbAlbums }) => {
    const firstAlbum = dbAlbums[0]!;
    const initialName = firstAlbum.name;

    const nonOwnerId = crypto.randomUUID();
    assert(nonOwnerId !== firstAlbum.userId);

    const res = await request(app)
      .patch(`/api/v1/albums/${firstAlbum.id}`)
      .send({ name: 'new-name' })
      .set('Authorization', `Bearer test-token:${nonOwnerId}`);

    expect(res.status).toBe(StatusCodes.FORBIDDEN);
    expect(res.body.error.code).toBe('ALBUM_ACCESS_DENIED');

    const fetchedAlbum = await db.query.albumsTable.findFirst({
      where: eq(albumsTable.id, firstAlbum.id),
    });
    expect(fetchedAlbum?.name).toBe(initialName);
  });

  test('returns validation error for invalid request body', async ({ dbUser }) => {
    const res = await request(app)
      .patch(`/api/v1/albums/${crypto.randomUUID()}`)
      .send({ name: true, isPublic: 'not' })
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toEqual(expect.any(String));
    expect(res.body.error.details).toHaveLength(2);
  });

  test('unauthenticated request returns UNAUTHORIZED', async () => {
    const res = await request(app)
      .patch(`/api/v1/albums/${crypto.randomUUID()}`)
      .send({ name: 'new-name' });

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
