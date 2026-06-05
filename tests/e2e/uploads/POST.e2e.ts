import { app } from '@/app/app';
import { StatusCodes } from '@/shared/constants';
import request from 'supertest';
import { assert, describe, expect } from 'vitest';
import { test } from '../fixtures';
import { faker } from '@faker-js/faker';
import { db } from '@/shared/db/drizzle/client';
import { eq, desc } from 'drizzle-orm';
import {
  albumsUploadsTable,
  blobsTable,
  uploadsTable,
  userCountersTable,
} from '@/shared/db/drizzle/schema';

describe('POST /uploads', () => {
  test('authenticated user can initiate uploads', async ({ dbUser, dbUploads }) => {
    const fetchCountersQuery = db.query.userCountersTable.findFirst({
      where: eq(userCountersTable.userId, dbUser.id),
    });

    const countersBefore = await fetchCountersQuery.execute();

    const existingBlob = await db.query.blobsTable.findFirst({
      where: eq(blobsTable.id, dbUploads[0]!.blobId),
    });
    assert(existingBlob);

    const files = [
      {
        id: 'file_1',
        fileName: 'unique-hash',
        mimeType: 'image/png',
        sizeBytes: 42,
        sha256Hex: faker.string.hexadecimal({ length: 64, casing: 'lower', prefix: '' }),
        isPublic: true,
        ttl: '3d',
      },
      {
        id: 'file_2',
        fileName: 'not-unique-hash',
        mimeType: 'image/jpeg',
        sizeBytes: 1000,
        sha256Hex: existingBlob.hash.hex,
        isPublic: false,
      },
    ];

    const res = await request(app)
      .post(`/api/v1/uploads`)
      .send({ files })
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.CREATED);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data).toEqual([
      expect.objectContaining({
        id: 'file_1',
        status: 'upload_required',
        url: expect.any(String),
        method: 'PUT',
        headers: expect.objectContaining({
          'Content-Type': 'image/png',
          'Content-Length': 42,
          'x-amz-checksum-sha256': expect.any(String),
        }),
      }),
      expect.objectContaining({
        id: 'file_2',
        status: 'ok',
      }),
    ]);

    const countersAfter = await fetchCountersQuery.execute();
    assert(countersBefore && countersAfter);
    expect(countersAfter.totalUploads).toBe(countersBefore.totalUploads + 2);

    const lastTwoUploads = await db.query.uploadsTable.findMany({
      where: eq(uploadsTable.userId, dbUser.id),
      orderBy: desc(uploadsTable.createdAt),
      limit: 2,
      with: { blob: true },
    });

    expect(lastTwoUploads).toEqual([
      expect.objectContaining({
        fileName: 'unique-hash',
        isPublic: true,
        expiresAt: expect.any(Date),
        blob: expect.objectContaining({
          mimeType: 'image/png',
          sizeBytes: 42,
          status: 'pending',
        }),
      }),
      expect.objectContaining({
        fileName: 'not-unique-hash',
        isPublic: false,
        expiresAt: null,
        blob: expect.objectContaining({
          status: 'ready',
        }),
      }),
    ]);
  });

  test('supports automatic album linking', async ({ dbUser, dbAlbums }) => {
    const firstAlbum = dbAlbums[0]!;
    const albumSizeBefore = await db.$count(
      albumsUploadsTable,
      eq(albumsUploadsTable.albumId, firstAlbum.id),
    );

    const files = [
      {
        id: 'file_1',
        fileName: 'new-file',
        mimeType: 'image/png',
        sizeBytes: 42,
        sha256Hex: faker.string.hexadecimal({ length: 64, casing: 'lower', prefix: '' }),
        isPublic: true,
      },
    ];

    await request(app)
      .post(`/api/v1/uploads`)
      .send({ albumId: firstAlbum.id, files })
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    const albumSizeAfter = await db.$count(
      albumsUploadsTable,
      eq(albumsUploadsTable.albumId, firstAlbum.id),
    );

    expect(albumSizeAfter).toBe(albumSizeBefore + 1);
  });

  test('returns validation error for invalid request body', async ({ dbUser }) => {
    const files = [
      {
        id: 'file_1',
        fileName: 'new-file',
        mimeType: 'image/png',
        sizeBytes: '20kb', // 1. invalid format
        // 2. missing `sha256Hex`
        isPublic: true,
      },
    ];

    const res = await request(app)
      .post(`/api/v1/uploads`)
      .send({
        albumId: true, // 3. invalid format
        files,
      })
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toEqual(expect.any(String));
    expect(res.body.error.details).toHaveLength(3);
  });

  test('unauthenticated request returns UNAUTHORIZED', async () => {
    const res = await request(app).post(`/api/v1/uploads`);

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
