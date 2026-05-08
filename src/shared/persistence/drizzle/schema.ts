import * as t from 'drizzle-orm/pg-core';

export const plansTable = t.pgTable('plans', {
  id: t.varchar('id').primaryKey(),
  allowedMimeTypes: t.jsonb('allowed_mime_types').$type<string[]>().notNull(),
  maxFileSizeBytes: t.bigint('max_file_size_bytes', { mode: 'number' }).notNull(),
  maxStorageBytes: t.bigint('max_storage_bytes', { mode: 'number' }).notNull(),
});

export const usersTable = t.pgTable('users', {
  id: t.uuid('id').primaryKey(),
  auth0UserId: t.varchar('auth0_user_id', { length: 50 }).notNull().unique(),
  planId: t
    .varchar('plan_id')
    .references(() => plansTable.id, { onDelete: 'cascade' })
    .notNull(),
  email: t.varchar('email', { length: 255 }).unique(),
  emailVerified: t.boolean('email_verified').notNull(),
  identities: t.jsonb('identities').$type<{ provider: string; userId: string }[]>().notNull(),
  totalStorageBytes: t.bigint('total_storage_bytes', { mode: 'number' }).notNull(),
  createdAt: t.timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: t.timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: t.timestamp('deleted_at', { withTimezone: true }),
});

export const blobsTable = t.pgTable(
  'blobs',
  {
    id: t.uuid('id').primaryKey(),
    storageKey: t.varchar('storage_key', { length: 255 }).notNull().unique(),
    hash: t.varchar('hash', { length: 255 }).notNull(),
    hashAlgorithm: t.varchar('hash_algorithm', { length: 50 }).notNull(),
    mimeType: t.varchar('mime_type', { length: 50 }).notNull(),
    sizeBytes: t.bigint('size_bytes', { mode: 'number' }).notNull(),
    createdAt: t.timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: t.timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },

  (table) => [t.unique().on(table.hash, table.hashAlgorithm)],
);

export const mediaTable = t.pgTable('media', {
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
  expiresAt: t.timestamp('expires_at', { withTimezone: true }),
  createdAt: t.timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: t.timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const collectionsTable = t.pgTable('collections', {
  id: t.uuid('id').primaryKey(),
  userId: t
    .uuid('user_id')
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  name: t.varchar('name', { length: 50 }).notNull(),
  isPublic: t.boolean('is_public').notNull(),
  createdAt: t.timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: t.timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const collectionsMediaTable = t.pgTable(
  'collections_media',
  {
    collectionId: t
      .uuid('collection_id')
      .references(() => collectionsTable.id, { onDelete: 'cascade' })
      .notNull(),
    mediaId: t
      .uuid('media_id')
      .references(() => mediaTable.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [t.primaryKey({ columns: [table.collectionId, table.mediaId] })],
);

// export const identitiesTable = t.pgTable(
//   'identities',
//   {
//     id: t.uuid('id').primaryKey(),
//     userId: t
//       .uuid('user_id')
//       .references(() => usersTable.id, { onDelete: 'cascade' })
//       .notNull(),
//     provider: t.varchar('provider', { length: 50 }).notNull(),
//     providerUserId: t.varchar('provider_user_id', { length: 50 }).notNull(),
//     createdAt: t.timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
//     updatedAt: t.timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
//   },
//   (table) => [t.unique().on(table.provider, table.providerUserId)],
// );

// export const usersRelations = relations(usersTable, ({ many }) => ({
//   identities: many(identitiesTable),
// }));
//
// export const identitiesRelations = relations(identitiesTable, ({ one }) => ({
//   user: one(usersTable, {
//     fields: [identitiesTable.userId],
//     references: [usersTable.id],
//   }),
// }));
