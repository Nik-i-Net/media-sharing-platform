import { app } from '@/app/app';
import { StatusCodes } from '@/shared/constants';
import { db } from '@/shared/db/drizzle/client';
import { uploadsTable } from '@/shared/db/drizzle/schema';
import { inArray } from 'drizzle-orm';
import request from 'supertest';
import { assert, describe, expect } from 'vitest';
import { test } from '../fixtures';

describe('GET /albums/:id/uploads', () => {
  test('owner sees all uploads with additional info', async ({ dbUser, dbUploads, dbAlbums }) => {
    const firstAlbum = dbAlbums[0]!;
    const limit = Math.ceil(dbUploads.length / 2);

    const res = await request(app)
      .get(`/api/v1/albums/${firstAlbum.id}/uploads?page=1&limit=${limit}`)
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.data.length).toBe(limit);

    const hasPrivateUploads = res.body.data.some((u: { isPublic: boolean }) => !u.isPublic);
    expect(hasPrivateUploads).toBe(true);

    expect(res.body.data[0].isPublic).toBeDefined();
    expect(res.body.data[0].expiresAt).toBeDefined();
    expect(res.body.data[0].createdAt).toBeDefined();

    expect(res.body.meta).toMatchObject({
      page: 1,
      limit,
      totalItems: dbUploads.length,
      totalPages: 2,
    });
  });

  test('non-owner sees only public uploads', async ({ dbAlbums }) => {
    const firstAlbum = dbAlbums[0]!;
    const nonOwnerId = crypto.randomUUID();

    const res = await request(app)
      .get(`/api/v1/albums/${firstAlbum.id}/uploads`)
      .set('Authorization', `Bearer test-token:${nonOwnerId}`);

    expect(res.status).toBe(StatusCodes.OK);

    expect(res.body.data[0].isPublic).toBeUndefined();
    expect(res.body.data[0].expiresAt).toBeUndefined();
    expect(res.body.data[0].createdAt).toBeUndefined();

    const fetchedUploads = await db.query.uploadsTable.findMany({
      where: inArray(
        uploadsTable.id,
        res.body.data.map((u: { id: string }) => u.id),
      ),
    });
    expect(fetchedUploads.length).toBe(res.body.data.length);
    expect(fetchedUploads.every((u) => u.isPublic)).toBe(true);
  });

  test('returns ALBUM_ACCESS_DENIED when album is not accessible', async ({ dbAlbums }) => {
    const privateAlbum = dbAlbums.find((a) => !a.isPublic);
    assert(privateAlbum);

    const res1 = await request(app).get(`/api/v1/albums/${privateAlbum.id}/uploads`);
    expect(res1.status).toBe(StatusCodes.FORBIDDEN);
    expect(res1.body.error.code).toBe('ALBUM_ACCESS_DENIED');

    const nonexistentAlbumId = crypto.randomUUID();
    const res2 = await request(app).get(`/api/v1/albums/${nonexistentAlbumId}/uploads`);
    expect(res2.status).toBe(StatusCodes.FORBIDDEN);
    expect(res2.body.error.code).toBe('ALBUM_ACCESS_DENIED');
  });
});
