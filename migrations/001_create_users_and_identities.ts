import type { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS citext'); // Case-insensitive text

  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary();

    table.specificType('email', 'citext').notNullable().unique();
    table.boolean('email_verified').notNullable();

    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('identities', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();

    table.string('provider').notNullable();
    table.string('provider_user_id').notNullable();
    table.specificType('email', 'citext').nullable();
    table.boolean('email_verified').notNullable();

    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    table.unique(['provider', 'provider_user_id']);
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('identities');
  await knex.schema.dropTable('users');
}
