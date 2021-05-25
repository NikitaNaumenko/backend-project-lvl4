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

      reply.render('tasks/show', { task });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask', preValidation: app.authenticate }, async (_req, reply) => {
      const task = await new app.objection.models.task();
      const statuses = await app.objection.models.status.query();
      const executors = await app.objection.models.user.query();
      reply.render('tasks/new', {
        task,
        statuses: statuses.map((s) => ({ value: s.id, label: s.name })),
        executors: executors.map((e) => ({ value: e.id, label: e.fullName() }))
      });
      return reply;
    })
    .post('/tasks', { preValidation: app.authenticate }, async (req, reply) => {
      try {
        // TODO: Type cohersion
        const statusId = Number(req.body.data.statusId);
        const executorId = Number(req.body.data.executorId);

        const reqData = _.merge(req.body.data, { executorId, statusId, creatorId: req.user.id });
        const formData = await app.objection.models.task.fromJson(reqData);
        await app.objection.models.task.query().insert(formData);
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch ({ data }) {
        const statuses = await app.objection.models.status.query();
        const executors = await app.objection.models.user.query();

        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.render('tasks/new', {
          task: req.body.data,
          statuses: statuses.map((s) => ({ value: s.id, label: s.name })),
          executors: executors.map((e) => ({ value: e.id, label: e.fullName() })),
          errors: data
        });
        return reply;
      }
    })
    .get('/tasks/:id/edit', { name: 'editTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const task = await app.objection.models.task.query().findById(id);
      const statuses = await app.objection.models.status.query();
      const executors = await app.objection.models.user.query();

      reply.render('tasks/edit', {
        task,
        statuses: statuses.map((s) => ({ value: s.id, label: s.name })),
        executors: executors.map((e) => ({ value: e.id, label: e.fullName() })),
      });
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
