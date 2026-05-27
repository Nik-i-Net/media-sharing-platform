import { HashVO } from '@/features/uploads/domain/hash.value-object';
import { desc, relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import z from 'zod';

export const usersTable = t.pgTable('users', {
  id: t.uuid('id').primaryKey(),
  auth0UserId: t.varchar('auth0_user_id', { length: 50 }).notNull().unique(),
  email: t.varchar('email', { length: 255 }).unique(),
  emailVerified: t.boolean('email_verified').notNull(),
  identities: t
    .jsonb('identities')
    .$type<{ provider: string; providerUserId: string }[]>()
    .notNull(),
  createdAt: t.timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: t.timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: t.timestamp('deleted_at', { withTimezone: true }),
});

export const userCountersTable = t.pgTable('user_counters', {
  userId: t
    .uuid('user_id')
    .primaryKey()
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  totalStorageBytes: t.bigint('total_storage_bytes', { mode: 'number' }).notNull(),
  totalUploads: t.integer('total_uploads').notNull(),
  totalAlbums: t.integer('total_albums').notNull(),
  createdAt: t.timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: t.timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const plansTable = t.pgTable('plans', {
  id: t.varchar('id').primaryKey(),
  allowedMimeTypes: t.jsonb('allowed_mime_types').$type<string[]>().notNull(),
  maxFileSizeBytes: t.bigint('max_file_size_bytes', { mode: 'number' }).notNull(),
  maxTotalStorageBytes: t.bigint('max_total_storage_bytes', { mode: 'number' }).notNull(),
});

const sha256 = t.customType<{
  data: HashVO;
  driverData: Buffer | string;
}>({
  dataType: () => 'bytea',
  toDriver(value) {
    return value.value;
  },
  fromDriver(value) {
    // Regular queries
    if (Buffer.isBuffer(value)) return new HashVO(value);

    // Joined tables using QueryApi (v0.45.2) return '\\x' + hex
    if (typeof value === 'string' && value.startsWith('\\x')) {
      const hex = value.slice(2);
      const parsedResult = z.hash('sha256', { enc: 'hex' }).safeParse(hex);
      if (parsedResult.error) throw parsedResult.error;
      return HashVO.fromHex(parsedResult.data);
    }

    throw new Error('[CustomType.Sha256] Unexpected driver data type');
  },
});

export const blobStatus = t.pgEnum('blob_status', ['pending', 'ready', 'rejected']);

export const blobsTable = t.pgTable('blobs', {
  id: t.uuid('id').primaryKey(),
  hash: sha256('hash').notNull().unique(),
  mimeType: t.varchar('mime_type', { length: 50 }).notNull(),
  sizeBytes: t.bigint('size_bytes', { mode: 'number' }).notNull(),
  status: blobStatus('status').default('pending').notNull(),
  createdAt: t.timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: t.timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const uploadsTable = t.pgTable('uploads', {
  id: t.uuid('id').primaryKey(),
  userId: t
    .uuid('user_id')
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  blobId: t
    .uuid('blob_id')
    .references(() => blobsTable.id, { onDelete: 'cascade' })
    .notNull(),
  fileName: t.varchar('file_name', { length: 50 }).notNull(),
  isPublic: t.boolean('is_public').notNull().default(true),
  expiresAt: t.timestamp('expires_at', { withTimezone: true }),
  createdAt: t.timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: t.timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const uploadsRelations = relations(uploadsTable, ({ one }) => ({
  blob: one(blobsTable, {
    fields: [uploadsTable.blobId],
    references: [blobsTable.id],
  }),
}));

export const albumsTable = t.pgTable(
  'albums',
  {
    id: t.uuid('id').primaryKey(),
    userId: t
      .uuid('user_id')
      .references(() => usersTable.id, { onDelete: 'cascade' })
      .notNull(),
    name: t.varchar('name', { length: 50 }).notNull(),
    isPublic: t.boolean('is_public').notNull(),
    createdAt: t.timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: t.timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [t.index('idx_albums_userId_createdAtDESC').on(table.userId, desc(table.createdAt))],
);

export const albumsUploadsTable = t.pgTable(
  'albums_uploads',
  {
    albumId: t
      .uuid('album_id')
      .references(() => albumsTable.id, { onDelete: 'cascade' })
      .notNull(),
    uploadId: t
      .uuid('upload_id')
      .references(() => uploadsTable.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [t.primaryKey({ columns: [table.albumId, table.uploadId] })],
);

export const paymentProvider = t.pgEnum('payment_provider', ['stripe']);

export const paymentProfilesTable = t.pgTable(
  'payment_profiles',
  {
    id: t.uuid('id').primaryKey(),
    userId: t
      .uuid('user_id')
      .references(() => usersTable.id, { onDelete: 'cascade' })
      .notNull(),
    provider: paymentProvider('provider').notNull(),
    providerCustomerId: t.varchar('provider_customer_id', { length: 50 }).notNull(),
    createdAt: t.timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: t.timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    t
      .uniqueIndex('unique_payment_profiles_provider_providerUserId')
      .on(table.provider, table.providerCustomerId),
  ],
);

// TODO: add 'past_due'
export const subscriptionStatus = t.pgEnum('subscription_status', ['active', 'canceled']);

export const subscriptionsTable = t.pgTable(
  'subscriptions',
  {
    id: t.uuid('id').primaryKey(),
    userId: t
      .uuid('user_id')
      .references(() => usersTable.id, { onDelete: 'cascade' })
      .notNull(),
    planId: t
      .uuid('plan_id')
      .references(() => plansTable.id, { onDelete: 'cascade' })
      .notNull(),
    provider: paymentProvider('provider').notNull(),
    providerSubscriptionId: t.varchar('provider_subscription_id', { length: 50 }).notNull(),
    status: subscriptionStatus('status').notNull(),
    expiresAt: t.timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: t.timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: t.timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    t
      .uniqueIndex('unique_subscriptions_provider_providerSubscriptionId')
      .on(table.provider, table.providerSubscriptionId),
  ],
);
