exports.up = function(knex) {
   return knex.schema.createTable('task_labels', (table) => {
    table.increments('id').primary();
    table.integer('task_id').notNullable();
    table.integer('label_id').notNullable();

    table.foreign('task_id').references('id').inTable('tasks').onDelete('RESTRICT');
    table.foreign('label_id').references('id').inTable('labels').onDelete('RESTRICT');
  })
};

exports.down = (knex) => knex.schema.dropTable('task_labels'); 
