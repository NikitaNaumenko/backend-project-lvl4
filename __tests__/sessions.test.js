// @ts-check

import getApp from '../server/index.js';
import { generateUser, insertUser, auth } from './helpers/index.js';

describe('test session', () => {
  let app;
  let knex;
  let models;

  beforeAll(async () => {
    app = await getApp();
    knex = app.objection.knex;
    models = app.objection.models;
    await knex.migrate.latest();
  });

  it('test sign in / sign out', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newSession'),
    });

    expect(response.statusCode).toBe(200);

    const testuser = generateUser();
    await insertUser(app, testuser);
    const user = await models.user.query().findOne({ email: testuser.email });

    const cookie = await auth(app, user);

    const responseSignOut = await app.inject({
      method: 'DELETE',
      url: app.reverse('session'),
      cookies: cookie,
    });

    expect(responseSignOut.statusCode).toBe(302);
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    app.close();
  });
});
