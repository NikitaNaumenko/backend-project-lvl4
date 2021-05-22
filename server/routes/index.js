// @ts-check

import welcome from './welcome.js';
import users from './users.js';
import sessions from './sessions.js';
import statuses from './statuses.js';

const controllers = [
  welcome,
  users,
  sessions,
  statuses,
];

export default (app) => controllers.forEach((f) => f(app));
