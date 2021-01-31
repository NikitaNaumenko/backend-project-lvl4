import getApp from '../server/index.js';

describe('test users CRUD', () => {
  let app;
  let knex;
  let models;

  beforeAll(async () => {
    app = await getApp();
    knex = app.objection.knex;
    models = app.objection.models;
  })

  beforeEach(async () => {
    await knex.migrate.latest();
  });

  it('index', async () => {
    const res = await app.inject({
      method: 'GET',
      url: app.reverse('users'),
    });

    expect(res.statusCode).toBe(200);
  });

  it('new', async () => {
    const res = await app.inject({
      method: 'GET',
      url: app.reverse('newUser'),
    });

    expect(res.statusCode).toBe(200);
  });
});
