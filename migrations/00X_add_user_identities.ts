import type { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('user_identities', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').notNullable();

    table.string('provider', 50).notNullable();
    table.string('provider_user_id', 50).notNullable();

    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.index('provider_sub');
    table.unique(['provider', 'provider_user_id']);
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('user_identities');
}
