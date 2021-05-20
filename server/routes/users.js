import i18next from 'i18next';
import UserPolicy from '../policies/user_policy.js';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (_, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
    })
    .get('/users/new', { name: 'newUser' }, async (_, reply) => {
      const user = await new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .get('/users/:id/edit', { name: 'editUser' }, async (req, reply) => {
      const { id } = req.params;
      const user = await app.objection.models.user.query().findById(id);

      const policy = new UserPolicy(req.user, user)

      if (policy.canEdit()) {
        reply.render('users/edit', { user });
      }
      else {
        req.flash('error', i18next.t('flash.users.edit.notAllowed'));
        reply.redirect(app.reverse('root'));
      }
    })
    .patch('/users/:id', { name: 'updateUser' }, async (req, reply) => {
      const { id } = req.params;
      const user = await app.objection.models.user.query().findById(id);

      const policy = new UserPolicy(req.user, user)

      if (policy.canUpdate()) {
        const userData = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().patch(userData)
      }
      else {
        req.flash('error', i18next.t('flash.users.edit.notAllowed'));
        reply.redirect(app.reverse('root'));
      }

    })
    .post('/users', async (req, reply) => {
      try {
        const user = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(user);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user: req.body.data, errors: data });
        return reply;
      }
    });
};
