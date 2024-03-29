exports.up = (knex) => knex.schema.createTable('tasks', (table) => {
  table.increments('id').primary();
  table.integer('creator_id').notNullable();
  table.integer('status_id').notNullable();
  table.integer('executor_id');
  table.string('name');
  table.string('description');

  table.foreign('creator_id').references('id').inTable('users');
  table.foreign('status_id').references('id').inTable('statuses');
  table.foreign('executor_id').references('id').inTable('users');
});

exports.down = (knex) => knex.schema.dropTable('tasks');
