import { HashVO } from '@/features/uploads/domain/hash.value-object';
import { MEMORY_UNITS } from '@/shared/constants';
import { db } from '@/shared/db/drizzle/client';
import {
  albumsTable,
  albumsUploadsTable,
  blobsTable,
  paymentProfilesTable,
  subscriptionsTable,
  uploadsTable,
  userCountersTable,
  usersTable,
} from '@/shared/db/drizzle/schema';
import { ENV } from '@/shared/env.loader';
import { faker } from '@faker-js/faker';
import { eq, inArray, type InferInsertModel } from 'drizzle-orm';
import { randomBytes } from 'node:crypto';
import { test as baseTest } from 'vitest';

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
      totalUploads: 5,
      totalAlbums: 5,
    });

    onCleanup(async () => {
      await db.delete(usersTable).where(eq(usersTable.id, user.id));
    });

    return user;
  })

  // eslint-disable-next-line no-empty-pattern
  .extend('dbReadyBlobs', async ({}, { onCleanup }) => {
    const blobs: InferInsertModel<typeof blobsTable>[] = Array.from({ length: 5 }, () => ({
      id: crypto.randomUUID(),
      hash: new HashVO(randomBytes(32)),
      mimeType: faker.system.mimeType().slice(0, 20),
      sizeBytes: faker.number.int({ min: 100, max: MEMORY_UNITS.MiB }),
      status: 'ready',
    }));

    await db.insert(blobsTable).values(blobs);

    onCleanup(async () => {
      await db.delete(blobsTable).where(
        inArray(
          blobsTable.id,
          blobs.map((b) => b.id),
        ),
      );
    });

    return blobs;
  })

  .extend('dbUploads', async ({ dbUser, dbReadyBlobs }) => {
    const uploads: InferInsertModel<typeof uploadsTable>[] = dbReadyBlobs.map((blob, i) => ({
      id: crypto.randomUUID(),
      userId: dbUser.id,
      blobId: blob.id,
      fileName: faker.string.alphanumeric(10),
      isPublic: i % 2 === 0,
    }));

    await db.insert(uploadsTable).values(uploads);

    // NOTE: uploads are automatically deleted via ON DELETE CASCADE (userId)

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
  })

  .extend('auth0NewUser', async () => {
    const auth0UserId = faker.string.alphanumeric(15);

    return {
      userId: `auth0|${auth0UserId}`,
      email: faker.internet.email(),
      emailVerified: faker.datatype.boolean(),
      identities: [
        { provider: 'auth0', userId: auth0UserId },
        { provider: 'google-oauth2', userId: faker.string.numeric(15) },
      ],
    };
  })

  .extend('auth0ExistingUser', async ({ dbUser }) => {
    return {
      userId: dbUser.auth0UserId,
      email: dbUser.email,
      emailVerified: dbUser.emailVerified,
      identities: dbUser.identities.map((i) => ({
        provider: i.provider,
        userId: i.providerUserId,
      })),
    };
  })

  .extend('dbPaymentProfile', async ({ dbUser }) => {
    const paymentProfile: InferInsertModel<typeof paymentProfilesTable> = {
      id: crypto.randomUUID(),
      userId: dbUser.id,
      provider: 'stripe',
      providerCustomerId: `cus_${faker.string.alphanumeric(15)}`,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };

    await db.insert(paymentProfilesTable).values(paymentProfile);

    // NOTE: automatically deleted via ON DELETE CASCADE (userId)

    return paymentProfile;
  })

  .extend('dbActiveSubscription', async ({ dbUser }) => {
    const activeSubscription: InferInsertModel<typeof subscriptionsTable> = {
      id: crypto.randomUUID(),
      userId: dbUser.id,
      planId: 'pro',
      provider: 'stripe',
      providerSubscriptionId: `sub_${faker.string.alphanumeric(15)}`,
      status: 'active',
      expiresAt: faker.date.soon({ days: 30 }),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };

    await db.insert(subscriptionsTable).values(activeSubscription);

    // NOTE: automatically deleted via ON DELETE CASCADE (userId)

    return activeSubscription;
  })

  .extend('customerSubscriptionCreatedStripeEvent', async ({ dbUser }) => {
    return (customerId?: string) => ({
      id: `evt_${faker.string.alphanumeric(10)}`,
      type: 'customer.subscription.created',
      request: { idempotency_key: faker.string.alphanumeric(10) },
      data: {
        object: {
          id: `sub_${faker.string.alphanumeric(10)}`,
          object: 'subscription',
          customer: customerId ?? `cus_${faker.string.alphanumeric(10)}`,
          status: 'active',
          metadata: {
            userId: dbUser.id,
            planId: 'pro',
          },
          items: {
            object: 'list',
            data: [
              {
                object: 'subscription_item',
                current_period_end: Math.floor(faker.date.soon({ days: 30 }).getTime() / 1000),
                current_period_start: Math.floor(faker.date.recent().getTime() / 1000),
                price: {
                  id: ENV.STRIPE_PRO_PLAN_PRICE_ID,
                  active: true,
                },
              },
            ],
          },
        },
      },
    });
  })

  .extend(
    'customerSubscriptionUpdatedStripeEvent',
    async ({ dbPaymentProfile, dbActiveSubscription }) => {
      return {
        id: `evt_${faker.string.alphanumeric(10)}`,
        type: 'customer.subscription.updated',
        request: { idempotency_key: faker.string.alphanumeric(10) },
        data: {
          object: {
            id: dbActiveSubscription.providerSubscriptionId,
            object: 'subscription',
            customer: dbPaymentProfile.providerCustomerId,
            status: 'active',
            items: {
              object: 'list',
              data: [
                {
                  object: 'subscription_item',
                  current_period_end: Math.floor(faker.date.soon({ days: 30 }).getTime() / 1000),
                },
              ],
            },
          },
        },
      };
    },
  )

  .extend(
    'customerSubscriptionDeletedStripeEvent',
    async ({ dbPaymentProfile, dbActiveSubscription }) => {
      return {
        id: `evt_${faker.string.alphanumeric(10)}`,
        type: 'customer.subscription.deleted',
        request: { idempotency_key: faker.string.alphanumeric(10) },
        data: {
          object: {
            id: dbActiveSubscription.providerSubscriptionId,
            object: 'subscription',
            customer: dbPaymentProfile.providerCustomerId,
            status: 'canceled',
          },
        },
      };
    },
  );
