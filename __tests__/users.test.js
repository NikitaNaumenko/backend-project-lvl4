import getApp from '../server/index.js';
import { getTestData, prepareData } from './helpers/index.js';
import encrypt from '../server/lib/secure.js';
import { omit } from 'lodash';


describe('test users CRUD', () => {
  let app;
  let knex;
  let models;
  let testData;

  beforeAll(async () => {
    app = await getApp();
    knex = app.objection.knex;
    models = app.objection.models;
    testData = getTestData();
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    prepareData(app);
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

  it('edit', async () => {
    const user = await models.user.query().findOne({ email: testData.users.existing.email });
    const res = await app.inject({
      method: 'GET',
      url: app.reverse('editUser', { id: user.id.toString() }),
    });

    expect(res.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.users.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const expected = {
      ...omit(params, 'password'),
      passwordDigest: encrypt(params.password),
    };
    const user = await models.user.query().findOne({ email: params.email });
    expect(user).toMatchObject(expected);
  });
});
