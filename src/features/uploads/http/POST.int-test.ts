import { app } from '@/app/app';
import { StatusCodes } from '@/shared/constants';
import { db } from '@/shared/db/drizzle/client';
import { albumsUploadsTable, uploadsTable, userCountersTable } from '@/shared/db/drizzle/schema';
import { faker } from '@faker-js/faker';
import { test } from '@tests/integration/fixtures';
import { desc, eq } from 'drizzle-orm';
import request from 'supertest';
import { assert, describe, expect } from 'vitest';

describe('POST /uploads', () => {
  test('authenticated user can initiate uploads', async ({ dbUser, dbReadyBlobs }) => {
    const countersQuery = db.query.userCountersTable.findFirst({
      where: eq(userCountersTable.userId, dbUser.id),
    });
    const countersBefore = await countersQuery.execute();

    const uniqueFiles = Array.from({ length: 5 }, (_, i) => genFileInfo(`unique-file-${i}`));
    assert(dbReadyBlobs.length >= 3);
    const notUniqueFiles = Array.from({ length: 3 }, (_, i) =>
      genFileInfo(`not-unique-file-${i}`, dbReadyBlobs[i]!.hash.hex),
    );
    const files = [...uniqueFiles, ...notUniqueFiles];

    const res = await request(app)
      .post(`/api/v1/uploads`)
      .send({ files })
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.CREATED);
    expect(res.body.data.length).toBe(files.length);

    const groupedByStatus = Object.groupBy(
      res.body.data,
      ({ status }: { status: string }) => status,
    );
    expect(groupedByStatus.ok).toHaveLength(notUniqueFiles.length);
    expect(groupedByStatus.upload_required).toHaveLength(uniqueFiles.length);
    expect(groupedByStatus.upload_required).toEqual(
      expect.arrayContaining(
        uniqueFiles.map((file) => ({
          id: file.id,
          status: 'upload_required',
          url: expect.any(String),
          method: 'PUT',
          headers: expect.any(Object),
        })),
      ),
    );

    const countersAfter = await countersQuery.execute();
    assert(countersBefore && countersAfter);
    expect(countersAfter.totalUploads).toBe(countersBefore.totalUploads + files.length);

    const fetchedUploads = await db.query.uploadsTable.findMany({
      where: eq(uploadsTable.userId, dbUser.id),
      orderBy: desc(uploadsTable.createdAt),
      limit: files.length,
      with: { blob: true },
    });
    const pendingBlobsCount = fetchedUploads.filter((u) => u.blob.status === 'pending').length;
    expect(pendingBlobsCount).toBe(uniqueFiles.length);
  });

  test('supports automatic album linking', async ({ dbUser, dbAlbums }) => {
    const firstAlbum = dbAlbums[0]!;
    const albumSizeBefore = await db.$count(
      albumsUploadsTable,
      eq(albumsUploadsTable.albumId, firstAlbum.id),
    );

    const files = Array.from({ length: 5 }, (_, i) => genFileInfo(`file-${i}`));

    await request(app)
      .post(`/api/v1/uploads`)
      .send({ albumId: firstAlbum.id, files })
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    const albumSizeAfter = await db.$count(
      albumsUploadsTable,
      eq(albumsUploadsTable.albumId, firstAlbum.id),
    );

    expect(albumSizeAfter).toBe(albumSizeBefore + files.length);
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

function genFileInfo(id: string, hashHex?: string) {
  return {
    id,
    fileName: faker.string.alphanumeric(10),
    mimeType: 'image/png',
    sizeBytes: faker.number.int({ min: 10, max: 1000 }),
    sha256Hex: hashHex ?? faker.string.hexadecimal({ length: 64, casing: 'lower', prefix: '' }),
    isPublic: true,
  };
}
