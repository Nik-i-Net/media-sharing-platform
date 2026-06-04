import { HashVO } from '@/features/uploads/domain/hash.value-object';
import { MEMORY_UNITS } from '@/shared/constants';
import { db } from '@/shared/db/drizzle/client';
import {
  albumsTable,
  albumsUploadsTable,
  blobsTable,
  uploadsTable,
  userCountersTable,
  usersTable,
} from '@/shared/db/drizzle/schema';
import { faker } from '@faker-js/faker';
import { eq, inArray, type InferInsertModel } from 'drizzle-orm';
import { readFile } from 'node:fs/promises';
import { test as baseTest } from 'vitest';
import { type UploadedBlobsMetadata, uploadedBlobsMetadataPath } from '../assets/upload-to-r2';

export const test = baseTest
  // eslint-disable-next-line no-empty-pattern
  .extend('dbUser', async ({}, { onCleanup }) => {
    const auth0ProviderUserId = faker.string.alphanumeric(15);

    const user: InferInsertModel<typeof usersTable> = {
      id: crypto.randomUUID(),
      auth0UserId: `auth0|${auth0ProviderUserId}`,
      email: faker.internet.email(),
      emailVerified: true,
      identities: [
        { provider: 'auth0', providerUserId: auth0ProviderUserId },
        { provider: 'google-oauth2', providerUserId: faker.string.numeric(15) },
      ],
    };

    await db.insert(usersTable).values(user);

    await db.insert(userCountersTable).values({
      userId: user.id,
      totalStorageBytes: faker.number.int({
        min: 20 * MEMORY_UNITS.MiB,
        max: 50 * MEMORY_UNITS.MiB,
      }),
      totalUploads: 3,
      totalAlbums: 5,
    });

    onCleanup(async () => {
      await db.delete(usersTable).where(eq(usersTable.id, user.id));
    });

    return user;
  })

  .extend('dbUploads', async ({ dbUser }, { onCleanup }) => {
    const fileContent = await readFile(uploadedBlobsMetadataPath, 'utf-8');
    const uploadedBlobs = JSON.parse(fileContent) as UploadedBlobsMetadata;

    const blobs: InferInsertModel<typeof blobsTable>[] = uploadedBlobs.map((blob) => ({
      id: crypto.randomUUID(),
      hash: HashVO.fromHex(blob.sha256Hex),
      mimeType: blob.mimeType,
      sizeBytes: blob.sizeBytes,
      status: 'ready',
    }));

    const uploads: InferInsertModel<typeof uploadsTable>[] = blobs.map((blob, i) => ({
      id: crypto.randomUUID(),
      userId: dbUser.id,
      blobId: blob.id,
      fileName: faker.string.alphanumeric(10),
      isPublic: i % 2 === 0,
    }));

    await db.insert(blobsTable).values(blobs);
    await db.insert(uploadsTable).values(uploads);

    onCleanup(async () => {
      await db.delete(blobsTable).where(
        inArray(
          blobsTable.id,
          blobs.map((b) => b.id),
        ),
      );

      // NOTE: uploads are automatically deleted via ON DELETE CASCADE (userId)
    });

    return uploads;
  })

  .extend('dbAlbums', async ({ dbUser, dbUploads }) => {
    const albums: InferInsertModel<typeof albumsTable>[] = Array.from({ length: 5 }, (_, i) => ({
      id: crypto.randomUUID(),
      userId: dbUser.id,
      name: faker.string.alphanumeric(10),
      isPublic: i % 2 === 0,
    }));

    await db.insert(albumsTable).values(albums);

    const albumsUploads: InferInsertModel<typeof albumsUploadsTable>[] = [];
    albums.forEach((album) => {
      dbUploads.forEach((upload) => {
        albumsUploads.push({ albumId: album.id, uploadId: upload.id });
      });
    });

    await db.insert(albumsUploadsTable).values(albumsUploads);

    // NOTE: albums automatically deleted via ON DELETE CASCADE (userId)

    return albums;
  });
