import factories from './factories.js';
import getApp from '../../server/index.js';

export { factories };
export const launchApp = async () => {
  const app = await getApp();
  await app.objection.knex.migrate.latest();
  return app;
};

export const shutdownApp = async (app) => {
  await app.close();
  await app.objection.knex.rollback();
};

export const databaseHelpers = (app) => ({
  insert: {
    user: (data) => app.objection.models.user.query().insert(data),
    status: app.objection.models.user.query(),
  },
  findOne: {
    user: (data) => app.objection.models.user.query().findOne(data),
  },
});

export const auth = async (app) => {
  const userData = factories.user();
  const user = await databaseHelpers(app).insert.user(userData);

  const responseSignIn = await app.inject({
    method: 'POST',
    url: app.reverse('session'),
    body: {
      data: { email: userData.email, password: userData.password },
    },
  });

  const [sessionCookie] = responseSignIn.cookies;
  const { name, value } = sessionCookie;
  const cookie = { [name]: value };
  return { user, cookie };
};
