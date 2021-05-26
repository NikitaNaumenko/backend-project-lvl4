exports.up = function(knex) {
   return knex.schema.createTable('labels', (table) => {
    table.increments('id').primary();
    table.string('name');
  })
};

exports.down = (knex) => knex.schema.dropTable('labels'); 
