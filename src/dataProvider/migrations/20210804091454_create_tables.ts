import { tables } from '@src/dataProvider/database';
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('users', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
      table.string('name', 200).notNullable();
      table.string('email', 200).unique().notNullable();
      table.string('password', 255).notNullable();
      table.string('passwordDuo', 255).notNullable();
      table.boolean('accountVerified').notNullable().defaultTo(false);
      table.timestamp('createdAt').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
      table
        .timestamp('updatedAt')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    })
    .createTable('categories', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
      table.string('description', 200).notNullable();
      table.timestamp('createdAt').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
      table
        .timestamp('updatedAt')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    })
    .createTable('transactions', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
      table.string('date');
      table.decimal('value', 8, 2);
      table.string('description', 255).notNullable();
      table.integer('month').notNullable();
      table.double('year').notNullable();
      table.integer('day').notNullable();
      table
        .uuid('userid')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .uuid('categoryid')
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE');
      table.timestamp('createdAt').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
      table
        .timestamp('updatedAt')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table(tables.transactions, (table) => {
    table.dropForeign('userId', 'transactions_userid_foreign');
    table.dropForeign('categoryId', 'transactions_categoryid_foreign');
  });

  return knex.schema
    .dropTable(tables.users)
    .dropTable(tables.transactions)
    .dropTable(tables.categories);
}
