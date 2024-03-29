import { Model } from 'objection';
import path from 'path';

export default class Label extends Model {
  static get tableName() {
    return 'labels';
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

  static get relationMappings() {
    return {
      tasks: {
        relation: Model.ManyToManyRelation,
        modelClass: path.join(__dirname, 'Task'),
        join: {
          from: 'labels.id',
          through: {
            from: 'task_labels.labelId',
            to: 'task_labels.taskId',
          },
          to: 'tasks.id',
        },
      },
    };
  }
}
