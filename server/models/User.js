import { Model } from 'objection';
import objectionUnique from 'objection-unique';

import encrypt from '../lib/secure.js';

const unique = objectionUnique({ fields: ['email'] });

export default class User extends unique(Model) {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'password', 'firstName', 'lastName'],
      properties: {
        id: { type: 'integer' },
        firstName: { type: 'string', minLength: 1 },
        lastName: { type: 'string', minLength: 1 },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 3 },
      },
    };
  }

  set password(value) {
    this.passwordDigest = encrypt(value);
  }

  fullName() {
    return [this.firstName, this.lastName].join(' ')
  }

  verifyPassword(password) {
    return encrypt(password) === this.passwordDigest;
  }

  static get relationMappings() {
    const Task = require('./Task.js');

    return {
      tasks: {
        relation: Model.HasManyRelation,
        modelClass: Task,
        join: {
          from: 'users.id',
          to: 'tasks.creatorId',
        },
      },
      assignedTasks: {
        relation: Model.HasManyRelation,
        modelClass: Task,
        join: {
          from: 'users.id',
          to: 'tasks.executorId',
        },
      },
    };
  }
}
