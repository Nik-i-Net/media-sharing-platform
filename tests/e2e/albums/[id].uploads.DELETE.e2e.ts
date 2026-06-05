import { app } from '@/app/app';
import { StatusCodes } from '@/shared/constants';
import { db } from '@/shared/db/drizzle/client';
import { albumsUploadsTable } from '@/shared/db/drizzle/schema';
import { eq } from 'drizzle-orm';
import request from 'supertest';
import { describe, expect } from 'vitest';
import { test } from '../fixtures';

describe('DELETE /albums/:id/uploads', () => {
  test('owner can unlink uploads from album', async ({ dbUser, dbUploads, dbAlbums }) => {
    const firstAlbum = dbAlbums[0]!;
    const countBefore = dbUploads.length;

    const res = await request(app)
      .delete(`/api/v1/albums/${firstAlbum.id}/uploads`)
      .send({ uploadIds: [dbUploads[0]!.id, dbUploads[1]!.id] })
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.NO_CONTENT);

    const countAfter = await db.$count(
      albumsUploadsTable,
      eq(albumsUploadsTable.albumId, firstAlbum.id),
    );

    expect(countAfter).toBe(countBefore - 2);
  });

  test('returns ALBUM_ACCESS_DENIED when album is not accessible', async ({
    dbUploads,
    dbAlbums,
  }) => {
    const firstAlbum = dbAlbums[0]!;
    const nonOwnerId = crypto.randomUUID();
    const countBefore = dbUploads.length;

    const res = await request(app)
      .delete(`/api/v1/albums/${firstAlbum.id}/uploads`)
      .send({ uploadIds: [dbUploads[0]!.id, dbUploads[1]!.id] })
      .set('Authorization', `Bearer test-token:${nonOwnerId}`);

    expect(res.status).toBe(StatusCodes.FORBIDDEN);
    expect(res.body.error.code).toBe('ALBUM_ACCESS_DENIED');

    const countAfter = await db.$count(
      albumsUploadsTable,
      eq(albumsUploadsTable.albumId, firstAlbum.id),
    );

    expect(countAfter).toBe(countBefore);
  });

  test('unauthenticated request returns UNAUTHORIZED', async () => {
    const res = await request(app)
      .delete(`/api/v1/albums/${crypto.randomUUID()}/uploads`)
      .send({ uploadIds: [crypto.randomUUID()] });

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
