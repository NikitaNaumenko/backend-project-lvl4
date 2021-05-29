import i18next from 'i18next';

export default (app) => {
  app.get('/session/new', { name: 'newSession' }, async (_, reply) => {
    const signInForm = {};
    reply.render('session/new', { signInForm });
  }).post('/session', { name: 'createSession' }, app.fp.authenticate('form', async (req, reply, err, user) => {
    if (err) {
      return app.httpErrors.internalServerError(err);
    }
    if (!user) {
      const signInForm = req.body.data;
      const errors = {
        email: [{ message: i18next.t('flash.sessions.create.error') }],
      };
      return reply.render('session/new', { signInForm, errors });
    }
    await req.logIn(user);
    req.flash('success', i18next.t('flash.sessions.create.success'));
    return reply.redirect(app.reverse('root'));
  })).delete('/session', { name: 'destroySession' }, async (req, reply) => {
    req.logOut();
    req.flash('info', i18next.t('flash.sessions.delete.success'));
    reply.redirect(app.reverse('root'));
  });
};
