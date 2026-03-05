import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('blobs', (table) => {
    table.uuid('id').primary();

    table.string('storage_key', 255).notNullable().unique();
    table.string('content_type', 255).notNullable();
    table.integer('content_length').notNullable();
    table.string('hash', 255).notNullable().unique();
    table.string('hash_algorithm', 255).notNullable();
    table.enum('status', ['pending', 'ready'], { useNative: true, enumName: 'blob_status' }).defaultTo('pending');

    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('media', (table) => {
    table.string('id', 12).primary(); // nanoid
    table.uuid('user_id').nullable();
    table.string('blob_id').notNullable();

    table.string('title', 50).nullable();
    table.enum('status', ['pending', 'ready'], { useNative: true, enumName: 'media_status' }).defaultTo('pending');

    table.timestamp('expires_at', { useTz: true }).nullable();
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('blob_id').references('id').inTable('blobs').onDelete('CASCADE');
    table.index('user_id');
    table.index('blob_id');
    table.index('expires_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('media');
}
