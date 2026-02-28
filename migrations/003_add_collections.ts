import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('collections', (table) => {
    table.string('id', 12).primary(); // nanoid
    table.uuid('user_id').notNullable();

    table.string('name', 50).notNullable();

    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.index('user_id');
  });

  await knex.schema.createTable('collection_media', (table) => {
    table.string('collection_id').notNullable();
    table.string('media_id').notNullable();

    table.foreign('collection_id').references('id').inTable('collections').onDelete('CASCADE');
    table.foreign('media_id').references('id').inTable('media').onDelete('CASCADE');
    table.primary(['collection_id', 'media_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('collections');
  await knex.schema.dropTable('collection_media');
}
