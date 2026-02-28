import type { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS citext'); // Case-insensitive text

  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary();

    table.specificType('username', 'citext').notNullable().unique();
    table.specificType('email', 'citext').notNullable().unique();
    table.boolean('email_verified').notNullable();
    table.string('password_hash', 255).notNullable();

    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('users');
}
