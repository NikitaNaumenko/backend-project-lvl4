// @ts-check

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
    })
    .get('/users/new', { name: 'newUser' }, async (req, reply) => {
      const user = await new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .post('/users', async (req, reply) => {

    });
};
