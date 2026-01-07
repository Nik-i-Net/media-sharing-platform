import type { Knex } from 'knex';
import { generateUpdatedAtTriggerSql } from './helpers/generate-updated-at-trigger.js';

const tableName = 'users';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.uuid('id').primary();
    table.string('username', 20).notNullable().unique();
    table.string('email', 254).notNullable().unique();
    table.boolean('email_verified').notNullable().defaultTo(false);
    table.string('password_hash', 255).notNullable();
    table.timestamps(true, true);
  });

  return knex.raw(generateUpdatedAtTriggerSql(tableName));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
