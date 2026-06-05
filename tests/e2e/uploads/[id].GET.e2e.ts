import { app } from '@/app/app';
import { StatusCodes } from '@/shared/constants';
import assert from 'node:assert';
import request from 'supertest';
import { describe, expect } from 'vitest';
import { test } from '../fixtures';

describe('GET /uploads/:id', () => {
  test('owner can access upload with edit permission', async ({ dbUser, dbUploads }) => {
    const ownerId = dbUser.id;
    const firstUpload = dbUploads[0]!;

    const res = await request(app)
      .get(`/api/v1/uploads/${firstUpload.id}`)
      .set('Authorization', `Bearer test-token:${ownerId}`);

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.data).toMatchObject({
      id: firstUpload.id,
      fileName: firstUpload.fileName,
      mimeType: expect.any(String),
      sizeBytes: expect.any(Number),
      url: expect.any(String),
    });
    expect(res.body.data.canEdit).toBe(true);
    expect(res.body.data.isPublic).toBeDefined();
    expect(res.body.data.expiresAt).toBeDefined();
    expect(res.body.data.createdAt).toBeDefined();
  });

  test('non-owner can access public upload without edit permission', async ({ dbUploads }) => {
    const publicUpload = dbUploads.find((a) => a.isPublic);
    assert(publicUpload);

    const nonOwnerId = crypto.randomUUID();

    const res = await request(app)
      .get(`/api/v1/uploads/${publicUpload.id}`)
      .set('Authorization', `Bearer test-token:${nonOwnerId}`);

    expect(res.status).toBe(StatusCodes.OK);

    expect(res.body.data).toMatchObject({
      id: publicUpload.id,
      fileName: publicUpload.fileName,
      mimeType: expect.any(String),
      sizeBytes: expect.any(Number),
      url: expect.any(String),
    });
    expect(res.body.data.canEdit).toBe(false);
    expect(res.body.data.isPublic).toBeUndefined();
    expect(res.body.data.expiresAt).toBeUndefined();
    expect(res.body.data.createdAt).toBeUndefined();

    const guestRes = await request(app).get(`/api/v1/uploads/${publicUpload.id}`);
    expect(guestRes.status).toBe(StatusCodes.OK);
    expect(guestRes.body.data.canEdit).toBe(false);
  });

  test('non-owner receives UPLOAD_NOT_FOUND for private upload', async ({ dbUploads }) => {
    const privateUpload = dbUploads.find((a) => !a.isPublic);
    assert(privateUpload);

    const nonOwnerId = crypto.randomUUID();

    const res = await request(app)
      .get(`/api/v1/uploads/${privateUpload.id}`)
      .set('Authorization', `Bearer test-token:${nonOwnerId}`);

    expect(res.status).toBe(StatusCodes.NOT_FOUND);
    expect(res.body.error).toMatchObject({
      code: 'UPLOAD_NOT_FOUND',
      message: expect.any(String),
    });
  });
});
