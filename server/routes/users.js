import i18next from 'i18next';
import UserPolicy from '../policies/user_policy.js';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (_, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, async (_, reply) => {
      const user = await new app.objection.models.user();
      reply.render('users/new', { user });
      return reply;
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
    })
    .get('/users/:id/edit', { name: 'editUser', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const user = await app.objection.models.user.query().findById(id);

      const policy = new UserPolicy(req.user, user);

      if (policy.canEdit()) {
        reply.render('users/edit', { user });
        return reply;
      }
      req.flash('error', i18next.t('flash.users.edit.notAllowed'));
      reply.redirect(app.reverse('root'));
      return reply;
    })
    .patch('/users/:id', { name: 'updateUser', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const user = await app.objection.models.user.query().findById(id);

      const policy = new UserPolicy(req.user, user);

      if (!policy.canUpdate()) {
        req.flash('error', i18next.t('flash.users.edit.notAllowed'));
        reply.redirect(app.reverse('root'));
        return reply;
      }
      try {
        const patchForm = await app.objection.models.user.fromJson(req.body.data);
        await user.$query().patch(patchForm);
        req.flash('error', i18next.t('flash.users.edit.success'));
        reply.redirect(app.reverse('users'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.edit.error'));
        req.body.data.id = id;
        reply.render('users/edit', { user: req.body.data, errors: data });
        return reply;
      }
    })
    .delete('/users/:id', { name: 'deleteUser', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const user = await app.objection.models.user.query().findById(id);

      const policy = new UserPolicy(req.user, user);

      if (!policy.canDelete()) {
        req.flash('error', i18next.t('flash.users.edit.notAllowed'));
        reply.redirect(app.reverse('root'));
        return reply;
      }

      try {
        await app.objection.models.user.query().deleteById(id);
        req.logOut();
        req.flash('info', i18next.t('flash.users.delete.success'));
        reply.redirect(app.reverse('users'));
        return reply;
      } catch (error) {
        req.flash('error', i18next.t('flash.users.delete.error'));
        reply.redirect(app.reverse('users'));
        return reply;
      }
    });
};
