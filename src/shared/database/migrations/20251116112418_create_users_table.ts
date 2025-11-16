import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary();
    table.string('username', 20).notNullable().unique();
    table.string('email', 254).notNullable().unique();
    table.boolean('email_verified').notNullable().defaultTo(false);
    table.string('password_hash', 255).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
