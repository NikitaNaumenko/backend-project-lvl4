import { omit } from 'lodash';
import {
  auth, factories, databaseHelpers, launchApp, shutdownApp,
} from './helpers/index.js';
import encrypt from '../server/lib/secure.js';

describe('test users CRUD', () => {
  let app;

  beforeAll(async () => {
    app = await launchApp();
  });

  afterAll(async () => {
    await shutdownApp(app);
  });

  describe('when not authenticated', () => {
    it('index', async () => {
      const res = await app.inject({ method: 'GET', url: app.reverse('users') });
      expect(res.statusCode).toBe(200);
    });

    it('new', async () => {
      const res = await app.inject({ method: 'GET', url: app.reverse('newUser') });
      expect(res.statusCode).toBe(200);
    });

    it('edit', async () => {
      const userData = factories.user();
      await databaseHelpers(app).insert.user(userData);
      const user = await databaseHelpers(app).findOne.user({ email: userData.email });

      const res = await app.inject({ method: 'GET', url: app.reverse('editUser', { id: user.id }) });
      expect(res.statusCode).toBe(302);
    });

    it('update', async () => {
      const userData = factories.user();
      await databaseHelpers(app).insert.user(userData);
      const user = await databaseHelpers(app).findOne.user({ email: userData.email });

      const newUserData = factories.user();
      const res = await app.inject({
        method: 'PATCH',
        url: app.reverse('updateUser', { id: user.id.toString() }),
        body: { data: newUserData },
      });

      expect(res.statusCode).toBe(302);
    });

    it('create', async () => {
      const userData = factories.user();
      const res = await app.inject({
        method: 'POST',
        url: app.reverse('users'),
        body: { data: userData },
      });

      expect(res.statusCode).toBe(302);
      const expected = { ...omit(userData, 'password'), passwordDigest: encrypt(userData.password) };

      const createdUser = await databaseHelpers(app).findOne.user({ email: userData.email });
      expect(createdUser).toMatchObject(expected);
    });
  });

  describe('when authenticated', () => {
    let user;
    let cookie;

    beforeAll(async () => {
      const result = await auth(app);
      cookie = result.cookie;
      user = result.user;
    });

    it('edit when authorized', async () => {
      const res = await app.inject({
        method: 'GET',
        url: app.reverse('editUser', { id: user.id }),
        cookies: cookie,
      });

      expect(res.statusCode).toBe(200);
    });

    it('edit when not authorized', async () => {
      const editedUserData = factories.user();
      const editedUser = await databaseHelpers(app).insert.user(editedUserData);

      const res = await app.inject({
        method: 'GET',
        url: app.reverse('editUser', { id: editedUser.id }),
        cookies: cookie,
      });

      expect(res.statusCode).toBe(302);
    });

    it('update when authorized', async () => {
      const userData = factories.user();
      const res = await app.inject({
        method: 'PATCH',
        url: app.reverse('updateUser', { id: user.id }),
        cookies: cookie,
        body: { data: userData },
      });

      expect(res.statusCode).toBe(302);
    });

    it('update when not authorized', async () => {
      const userData = factories.user();
      const editedUser = await databaseHelpers(app).insert.user(userData);

      const newUserData = factories.user();
      const res = await app.inject({
        method: 'PATCH',
        url: app.reverse('updateUser', { id: editedUser.id }),
        cookies: cookie,
        body: { data: newUserData },
      });

      expect(res.statusCode).toBe(302);
    });
  });
});
