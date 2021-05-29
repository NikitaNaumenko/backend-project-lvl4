import { Model } from 'objection';

export default class Status extends Model {
  static get tableName() {
    return 'statuses';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
      },
    };
  }

  // static get relationMappings() {
  //   const Task = require('./Task.js');
  //   return {
  //     tasks: {
  //       relation: Model.HasManyRelation,
  //       modelClass: Task,
  //       join: {
  //         from: 'statuses.id',
  //         to: 'tasks.statusId',
  //       },
  //     },
  //   };
  // }
}
