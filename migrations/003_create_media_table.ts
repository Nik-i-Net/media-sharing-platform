import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('media', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').nullable();
    table.uuid('collection_id').nullable();

    table.text('storage_url').notNullable();
    table.string('title', 255);

    table.timestamp('expires_at', { useTz: true }).nullable();
    table.timestamp('created_at', { useTz: true }).notNullable();

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('collection_id').references('id').inTable('collections').onDelete('CASCADE');
    table.index('user_id');
    table.index('collection_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('media');
}
