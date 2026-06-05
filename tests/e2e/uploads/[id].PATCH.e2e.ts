import { app } from '@/app/app';
import { StatusCodes } from '@/shared/constants';
import { db } from '@/shared/db/drizzle/client';
import { uploadsTable } from '@/shared/db/drizzle/schema';
import { eq } from 'drizzle-orm';
import request from 'supertest';
import { assert, describe, expect } from 'vitest';
import { test } from '../fixtures';

describe('PATCH /uploads/:id', () => {
  test('owner can update uploads', async ({ dbUser, dbUploads }) => {
    const firstUpload = dbUploads[0]!;
    const newFileName = 'new-file-name';

    const res = await request(app)
      .patch(`/api/v1/uploads/${firstUpload.id}`)
      .send({ fileName: newFileName })
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.NO_CONTENT);

    const fetchedUpload = await db.query.uploadsTable.findFirst({
      where: eq(uploadsTable.id, firstUpload.id),
    });
    expect(fetchedUpload).toMatchObject({
      userId: dbUser.id,
      fileName: newFileName,
      isPublic: firstUpload.isPublic,
    });
  });

  test('non-owner cannot update uploads', async ({ dbUploads }) => {
    const firstUpload = dbUploads[0]!;
    const initialFileName = firstUpload.fileName;

    const nonOwnerId = crypto.randomUUID();
    assert(nonOwnerId !== firstUpload.userId);

    const res = await request(app)
      .patch(`/api/v1/uploads/${firstUpload.id}`)
      .send({ name: 'new-file-name' })
      .set('Authorization', `Bearer test-token:${nonOwnerId}`);

    expect(res.status).toBe(StatusCodes.FORBIDDEN);
    expect(res.body.error.code).toBe('FORBIDDEN');

    const fetchedUpload = await db.query.uploadsTable.findFirst({
      where: eq(uploadsTable.id, firstUpload.id),
    });
    expect(fetchedUpload?.fileName).toBe(initialFileName);
  });

  test('returns validation error for invalid request body', async ({ dbUser }) => {
    const res = await request(app)
      .patch(`/api/v1/uploads/${crypto.randomUUID()}`)
      .send({ fileName: true, isPublic: 'not' })
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toEqual(expect.any(String));
    expect(res.body.error.details).toHaveLength(2);
  });

  test('unauthenticated request returns UNAUTHORIZED', async () => {
    const res = await request(app)
      .patch(`/api/v1/uploads/${crypto.randomUUID()}`)
      .send({ name: 'new-file-name' });

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
