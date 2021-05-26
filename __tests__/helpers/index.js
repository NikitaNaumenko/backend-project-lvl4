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
    status: (data) => app.objection.models.status.query().insert(data),
    task: (data) => app.objection.models.task.query().insert(data),
    label: (data) => app.objection.models.label.query().insert(data),
  },
  findOne: {
    user: (data) => app.objection.models.user.query().findOne(data),
    status: (data) => app.objection.models.status.query().findOne(data),
    task: (data) => app.objection.models.task.query().findOne(data),
    label: (data) => app.objection.models.label.query().findOne(data),
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
