import i18next from 'i18next';
import _ from 'lodash';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks', preValidation: app.authenticate }, async (_req, reply) => {
      const tasks = await app.objection.models.task.query().withGraphJoined('[creator, executor, status]');
      reply.render('tasks/index', { tasks });
      return reply;
    })
    .get('/tasks/:id', { name: 'task', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const task = await app.objection.models.task.query().findById(id);

      reply.render('task/show', { task });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask', preValidation: app.authenticate }, async (_req, reply) => {
      const task = await new app.objection.models.task();
      const statuses = await app.objection.models.status.query();
      const executors = await app.objection.models.user.query();
      reply.render('task/new', { task, statuses, executors });
      return reply;
    })
    .post('/tasks', { preValidation: app.authenticate }, async (req, reply) => {
      try {
        const reqData = _.merge(req.body.data, { creatorId: req.user.id });
        const formData = await app.objection.models.task.fromJson(reqData);
        await app.objection.models.task.query().insert(formData);
        req.flash('info', i18next.t('flash.task.create.success'));
        reply.redirect(app.reverse('root'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.task.create.error'));
        reply.render('tasks/new', { task: req.body.data, errors: data });
        return reply;
      }
    })
    .get('/tasks/:id/edit', { name: 'editTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const task = await app.objection.models.task.query().findById(id);
      const statuses = await app.objection.models.status.query();
      const executors = await app.objection.models.user.query();

      reply.render('tasks/edit', { task, statuses, executors });
      return reply;
    })
    .patch('/tasks/:id', { name: 'updateTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const task = await app.objection.models.task.query().findById(id);

      try {
        const reqData = _.merge(req.body.data, { creatorId: req.user.id });
        const formData = await app.objection.models.task.fromJson(reqData, { patch: true });
        await task.$query().patch(formData);
        req.flash('error', i18next.t('flash.tasks.edit.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.tasks.edit.error'));
        req.body.data.id = id;
        reply.render('tasks/edit', { task: req.body.data, errors: data });
        return reply;
      }
    })
    .delete('/tasks/:id', { name: 'deleteTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;

      try {
        await app.objection.models.task.query().deleteById(id);
        req.flash('info', i18next.t('flash.tasks.delete.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch (error) {
        req.flash('error', i18next.t('flash.tasks.delete.error'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      }
    });
};
