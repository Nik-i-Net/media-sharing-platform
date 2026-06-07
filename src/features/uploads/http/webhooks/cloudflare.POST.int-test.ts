import { app } from '@/app/app';
import { StatusCodes } from '@/shared/constants';
import { db } from '@/shared/db/drizzle/client';
import { blobsTable } from '@/shared/db/drizzle/schema';
import { ENV } from '@/shared/env.loader';
import { test } from '@tests/integration/fixtures';
import { inArray } from 'drizzle-orm';
import { randomBytes } from 'node:crypto';
import request from 'supertest';
import { assert, describe, expect } from 'vitest';
import { HashVO } from '../../domain/hash.value-object';

describe('Webhook: Cloudflare', () => {
  test('confirms uploads', async () => {
    const pendingBlobs = await db
      .insert(blobsTable)
      .values([
        {
          id: crypto.randomUUID(),
          hash: new HashVO(randomBytes(32)),
          mimeType: 'image/png',
          sizeBytes: 42,
          status: 'pending',
        },
        {
          id: crypto.randomUUID(),
          hash: new HashVO(randomBytes(32)),
          mimeType: 'audio/ogg',
          sizeBytes: 1042,
          status: 'pending',
        },
      ])
      .returning();

    const payload = {
      event: 'r2.upload.confirmed',
      objects: pendingBlobs.map((blob) => ({
        key: blob.hash.hex,
        sizeBytes: blob.sizeBytes,
        mimeType: blob.mimeType,
      })),
    };

    const res = await request(app)
      .post(`/api/v1/webhooks/cloudflare`)
      .send(payload)
      .set('x-api-key', ENV.CLOUDFLARE_API_KEY);

    expect(res.status).toBe(StatusCodes.OK);

    const fetchedBlobs = await db.query.blobsTable.findMany({
      where: inArray(
        blobsTable.id,
        pendingBlobs.map((blob) => blob.id),
      ),
    });

    assert(fetchedBlobs.length === pendingBlobs.length);
    expect(fetchedBlobs.every((blob) => blob.status === 'ready')).toBe(true);
  });

  test('returns validation error for invalid request body', async () => {
    const invalidPayload = {
      event: 'invalid.event', // 1. not supported event
      objects: [
        {
          // 2. missing `key`
          sizeBytes: 42,
          mimeType: 'invalid/mime-type', // 3. not supported mime type
        },
      ],
    };

    const res = await request(app)
      .post(`/api/v1/webhooks/cloudflare`)
      .send(invalidPayload)
      .set('x-api-key', ENV.CLOUDFLARE_API_KEY);

    expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toEqual(expect.any(String));
    expect(res.body.error.details).toHaveLength(3);
  });

  test('unauthenticated request returns UNAUTHORIZED', async () => {
    const res = await request(app).post(`/api/v1/webhooks/cloudflare`);

    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
