exports.up = function(knex) {
   return knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.integer('creatorId').notNullable();
    table.integer('statusId').notNullable();
    table.integer('executorId');
    table.string('name');

    table.foreign('creatorId').references('id').inTable('users');
    table.foreign('statusId').references('id').inTable('statuses');
    table.foreign('executorId').references('id').inTable('users');
  })
};

exports.down = (knex) => knex.schema.dropTable('tasks'); 
