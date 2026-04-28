import { relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';

export const usersTable = t.pgTable('users', {
  id: t.uuid('id').primaryKey(),
  email: t.varchar('email', { length: 255 }).unique(),
  emailVerified: t.boolean('email_verified').notNull(),
  totalStorageBytes: t.integer('total_storage_bytes').notNull(),
  createdAt: t.timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: t.timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: t.timestamp('deleted_at', { withTimezone: true }),
});

export const identitiesTable = t.pgTable(
  'identities',
  {
    id: t.uuid('id').primaryKey(),
    userId: t
      .uuid('user_id')
      .references(() => usersTable.id, { onDelete: 'cascade' })
      .notNull(),
    provider: t.varchar('provider', { length: 50 }).notNull(),
    providerUserId: t.varchar('provider_user_id', { length: 50 }).notNull(),
    email: t.varchar('email', { length: 255 }),
    emailVerified: t.boolean('email_verified').notNull(),
    createdAt: t.timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: t.timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [t.unique().on(table.provider, table.providerUserId)],
);

export const usersRelations = relations(usersTable, ({ many }) => ({
  identities: many(identitiesTable),
}));

export const identitiesRelations = relations(identitiesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [identitiesTable.userId],
    references: [usersTable.id],
  }),
}));
