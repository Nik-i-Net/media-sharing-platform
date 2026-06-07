import { app } from '@/app/app';
import { StatusCodes } from '@/shared/constants';
import { db } from '@/shared/db/drizzle/client';
import { albumsUploadsTable } from '@/shared/db/drizzle/schema';
import { test } from '@tests/integration/fixtures';
import { eq } from 'drizzle-orm';
import request from 'supertest';
import { describe, expect } from 'vitest';

describe('POST /albums/:id/uploads', () => {
  test('owner can link uploads to album', async ({ dbUser, dbUploads, dbAlbums }) => {
    const firstAlbum = dbAlbums[0]!;
    await db.delete(albumsUploadsTable).where(eq(albumsUploadsTable.albumId, firstAlbum.id));

    const res = await request(app)
      .post(`/api/v1/albums/${firstAlbum.id}/uploads`)
      .send({ uploadIds: [dbUploads[0]!.id, dbUploads[1]!.id] })
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.NO_CONTENT);

    const count = await db.$count(
      albumsUploadsTable,
      eq(albumsUploadsTable.albumId, firstAlbum.id),
    );

    expect(count).toBe(2);
  });

  test('returns ALBUM_ACCESS_DENIED when album is not accessible', async ({
    dbUploads,
    dbAlbums,
  }) => {
    const firstAlbum = dbAlbums[0]!;
    const nonOwnerId = crypto.randomUUID();
    await db.delete(albumsUploadsTable).where(eq(albumsUploadsTable.albumId, firstAlbum.id));

    const res = await request(app)
      .post(`/api/v1/albums/${firstAlbum.id}/uploads`)
      .send({ uploadIds: [dbUploads[0]!.id, dbUploads[1]!.id] })
      .set('Authorization', `Bearer test-token:${nonOwnerId}`);

    expect(res.status).toBe(StatusCodes.FORBIDDEN);
    expect(res.body.error.code).toBe('ALBUM_ACCESS_DENIED');

    const count = await db.$count(
      albumsUploadsTable,
      eq(albumsUploadsTable.albumId, firstAlbum.id),
    );

    expect(count).toBe(0);
  });

  test('returns validation error for invalid request body', async ({ dbUser, dbAlbums }) => {
    const firstAlbum = dbAlbums[0]!;

    const res = await request(app)
      .post(`/api/v1/albums/${firstAlbum.id}/uploads`)
      .send({ uploadIds: ['invalid-id', 42] })
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toEqual(expect.any(String));
    expect(res.body.error.details).toHaveLength(2);
  });

  test('unauthenticated request returns UNAUTHORIZED', async () => {
    const res = await request(app)
      .post(`/api/v1/albums/${crypto.randomUUID()}/uploads`)
      .send({ uploadIds: [crypto.randomUUID()] });

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
