import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('blobs', (table) => {
    table.increments('id').primary();

    table.string('storage_key', 255).notNullable().unique();
    table.string('hash', 255).notNullable();
    table.string('hash_algorithm', 255).notNullable();
    table.string('mime_type', 255).notNullable();
    table.integer('size_bytes').notNullable();
    table.enum('status', ['pending', 'ready'], { useNative: true, enumName: 'blob_status' }).defaultTo('pending');

    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    table.unique(['hash', 'hash_algorithm']);
  });

  await knex.schema.createTable('media', (table) => {
    table.string('id', 12).primary(); // nanoid
    table.uuid('user_id').nullable();
    table.integer('blob_id').unsigned().notNullable();

    table.string('title', 50).nullable();

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
