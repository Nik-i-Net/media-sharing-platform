import { app } from '@/app/app';
import { StatusCodes } from '@/shared/constants';
import assert from 'node:assert';
import request from 'supertest';
import { describe, expect } from 'vitest';
import { test } from '../fixtures';

describe('GET /albums/:id', () => {
  test('owner can access album with edit permission', async ({ dbUser, dbAlbums }) => {
    const ownerId = dbUser.id;
    const albumId = dbAlbums[0]!.id;

    const res = await request(app)
      .get(`/api/v1/albums/${albumId}`)
      .set('Authorization', `Bearer test-token:${ownerId}`);

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.data).toMatchObject({
      id: albumId,
      name: expect.any(String),
      canEdit: true,
      isPublic: expect.any(Boolean),
    });
  });

  test('non-owner can access public album without edit permission', async ({ dbAlbums }) => {
    const publicAlbum = dbAlbums.find((a) => a.isPublic);
    assert(publicAlbum);

    const nonOwnerId = crypto.randomUUID();

    const res = await request(app)
      .get(`/api/v1/albums/${publicAlbum.id}`)
      .set('Authorization', `Bearer test-token:${nonOwnerId}`);

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.data).toMatchObject({
      id: publicAlbum.id,
      name: expect.any(String),
      canEdit: false,
    });
    expect(res.body.data).not.toHaveProperty('isPublic');
  });

  test('guest can access public album without edit permission', async ({ dbAlbums }) => {
    const publicAlbum = dbAlbums.find((a) => a.isPublic);
    assert(publicAlbum);

    const res = await request(app).get(`/api/v1/albums/${publicAlbum.id}`);

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.data).toMatchObject({
      id: publicAlbum.id,
      name: expect.any(String),
      canEdit: false,
    });
    expect(res.body.data).not.toHaveProperty('isPublic');
  });

  test('non-owner receives ALBUM_NOT_FOUND for private album', async ({ dbAlbums }) => {
    const privateAlbum = dbAlbums.find((a) => !a.isPublic);
    assert(privateAlbum);

    const nonOwnerId = crypto.randomUUID();
    assert(nonOwnerId !== privateAlbum.userId);

    const res = await request(app)
      .get(`/api/v1/albums/${privateAlbum.id}`)
      .set('Authorization', `Bearer test-token:${nonOwnerId}`);

    expect(res.status).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).not.toHaveProperty('data');
    expect(res.body.error).toMatchObject({
      code: 'ALBUM_NOT_FOUND',
      message: expect.any(String),
    });
  });
});
