// @ts-check

import welcome from './welcome.js';
import users from './users.js';
import sessions from './sessions.js';

const controllers = [
  welcome,
  users,
  sessions,
];

export default (app) => controllers.forEach((f) => f(app));
