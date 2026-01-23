import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('collections', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').notNullable();

    table.string('name', 50).notNullable();
    table.string('description', 255);

    table.timestamp('created_at', { useTz: true }).notNullable();

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.index('user_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('collections');
}
