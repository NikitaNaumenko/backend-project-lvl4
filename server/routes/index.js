// @ts-check

import welcome from './welcome.js';
import users from './users.js';
import sessions from './sessions.js';
import statuses from './statuses.js';
import tasks from './tasks.js';
import labels from './labels.js';

const controllers = [
  welcome,
  users,
  labels,
  sessions,
  statuses,
  tasks,
];

export default (app) => controllers.forEach((f) => f(app));
