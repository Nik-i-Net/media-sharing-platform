import * as t from 'drizzle-orm/pg-core';

const sha256 = t.customType<{ data: string; driverData: Buffer }>({
  dataType: () => 'bytea',
  fromDriver: (value: Buffer) => value.toString('hex'),
  toDriver: (value: string) => Buffer.from(value, 'hex'),
});

const statusEnum = t.pgEnum('blob_status', ['pending', 'ready', 'rejected']);

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
    .references(() => plansTable.id, { onDelete: 'no action' })
    .notNull(),
  email: t.varchar('email', { length: 255 }).unique(),
  emailVerified: t.boolean('email_verified').notNull(),
  identities: t.jsonb('identities').$type<{ provider: string; userId: string }[]>().notNull(),
  totalStorageBytes: t.bigint('total_storage_bytes', { mode: 'number' }).notNull(),
  createdAt: t.timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: t.timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: t.timestamp('deleted_at', { withTimezone: true }),
});

export const blobsTable = t.pgTable('blobs', {
  id: t.uuid('id').primaryKey(),
  hash: sha256('hash').notNull().unique(),
  mimeType: t.varchar('mime_type', { length: 50 }).notNull(),
  sizeBytes: t.bigint('size_bytes', { mode: 'number' }).notNull(),
  status: statusEnum('status').default('pending').notNull(),
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
  expiresAt: t.timestamp('expires_at', { withTimezone: true }),
  createdAt: t.timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: t.timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const albumsTable = t.pgTable('albums', {
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
