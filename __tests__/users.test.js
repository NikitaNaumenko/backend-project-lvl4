import { omit } from 'lodash';
import getApp from '../server/index.js';
import { generateUser, insertUser, auth } from './helpers/index.js';
import encrypt from '../server/lib/secure.js';

describe('test users CRUD', () => {
  let app;
  let knex;
  let models;

  beforeAll(async () => {
    app = await getApp();
    knex = app.objection.knex;
    models = app.objection.models;
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

  it('edit when authorized', async () => {
    const testuser = generateUser();
    await insertUser(app, testuser);
    const user = await models.user.query().findOne({ email: testuser.email });
    const cookie = await auth(app, user);
    const res = await app.inject({
      method: 'GET',
      url: app.reverse('editUser', { id: user.id.toString() }),
      cookies: cookie,
    });

    expect(res.statusCode).toBe(200);
  });

  it('edit when not authorized', async () => {
    const testuser = generateUser();
    await insertUser(app, testuser);
    const user = await models.user.query().findOne({ email: testuser.email });

    let editedUser = generateUser();
    await insertUser(app, editedUser);
    editedUser = await models.user.query().findOne({ email: editedUser.email });

    const cookie = await auth(app, user);
    const res = await app.inject({
      method: 'GET',
      url: app.reverse('editUser', { id: editedUser.id.toString() }),
      cookies: cookie,
    });

    expect(res.statusCode).toBe(302);
  });

  it('edit when not authenticated', async () => {
    const testuser = generateUser();
    await insertUser(app, testuser);
    const user = await models.user.query().findOne({ email: testuser.email });

    const res = await app.inject({
      method: 'GET',
      url: app.reverse('editUser', { id: user.id.toString() }),
    });

    expect(res.statusCode).toBe(302);
  });

  it('update when authorized', async () => {
    const testuser = generateUser();
    await insertUser(app, testuser);
    const user = await models.user.query().findOne({ email: testuser.email });
    const cookie = await auth(app, user);
    const params = generateUser();
    const res = await app.inject({
      method: 'PATCH',
      url: app.reverse('updateUser', { id: user.id.toString() }),
      cookies: cookie,
      payload: {
        data: params,
      },
    });

    expect(res.statusCode).toBe(302);
  });

  it('update when not authorized', async () => {
    const testuser = generateUser();
    await insertUser(app, testuser);
    const user = await models.user.query().findOne({ email: testuser.email });

    let editedUser = generateUser();
    await insertUser(app, editedUser);
    editedUser = await models.user.query().findOne({ email: editedUser.email });

    const cookie = await auth(app, user);
    const params = generateUser();
    const res = await app.inject({
      method: 'PATCH',
      url: app.reverse('updateUser', { id: editedUser.id.toString() }),
      cookies: cookie,
      payload: {
        data: params,
      },
    });

    expect(res.statusCode).toBe(302);
  });

  it('update when not authenticated', async () => {
    const testuser = generateUser();
    await insertUser(app, testuser);
    const user = await models.user.query().findOne({ email: testuser.email });

    const params = generateUser();
    const res = await app.inject({
      method: 'PATCH',
      url: app.reverse('updateUser', { id: user.id.toString() }),
      payload: {
        data: params,
      },
    });

    expect(res.statusCode).toBe(302);
  });

  it('create', async () => {
    const params = generateUser();
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
    const createdUser = await models.user.query().findOne({ email: params.email });
    expect(createdUser).toMatchObject(expected);
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    app.close();
  });
});
