import { app } from '@/app/app';
import { StatusCodes } from '@/shared/constants';
import { db } from '@/shared/db/drizzle/client';
import { uploadsTable } from '@/shared/db/drizzle/schema';
import { eq } from 'drizzle-orm';
import request from 'supertest';
import { describe, expect } from 'vitest';
import { test } from '../fixtures';

describe('DELETE /uploads/:id', () => {
  test('owner can delete upload', async ({ dbUser, dbUploads }) => {
    const firstUpload = dbUploads[0]!;

    const res = await request(app)
      .delete(`/api/v1/uploads/${firstUpload.id}`)
      .set('Authorization', `Bearer test-token:${dbUser.id}`);

    expect(res.status).toBe(StatusCodes.NO_CONTENT);

    const fetchedUpload = await db.query.uploadsTable.findFirst({
      where: eq(uploadsTable.id, firstUpload.id),
    });
    expect(fetchedUpload).toBeUndefined();
  });

  test('non-owner cannot delete upload', async () => {
    const nonOwnerId = crypto.randomUUID();

    const res = await request(app)
      .delete(`/api/v1/uploads/${crypto.randomUUID()}`)
      .set('Authorization', `Bearer test-token:${nonOwnerId}`);

    expect(res.status).toBe(StatusCodes.FORBIDDEN);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  test('unauthenticated request returns UNAUTHORIZED', async () => {
    const res = await request(app).delete(`/api/v1/uploads/${crypto.randomUUID()}`);

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
