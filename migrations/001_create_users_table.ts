import type { Knex } from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary();

    table.string('username', 20).notNullable().unique();
    table.string('email', 254).notNullable().unique();
    table.boolean('email_verified').notNullable();
    table.string('password_hash', 255).notNullable();

    table.timestamp('created_at', { useTz: true }).notNullable();
    table.timestamp('updated_at', { useTz: true }).notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('users');
}
