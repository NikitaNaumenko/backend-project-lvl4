// @ts-check

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      console.log('12222222')
      console.log(users)
      reply.render('users/index', { users });
    })
    .get('/users/new', { name: 'newUser' }, async (req, reply) => {
      const user = await app.objection.models.user();
      reply.render('users/new', { user });
    })
    .post('/users', async (req, reply) => {

    });
};
