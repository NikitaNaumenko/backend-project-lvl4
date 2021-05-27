import i18next from 'i18next';
import normalizeMultiSelect from '../lib/normalizeMultiSelect.js';

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
      const labels = await app.objection.models.label.query();
      reply.render('tasks/new', {
        task,
        statuses: statuses.map((s) => ({ value: s.id, label: s.name })),
        executors: executors.map((e) => ({ value: e.id, label: e.fullName() })),
        labels: labels.map((e) => ({ value: e.id, label: e.name })),
      });
      return reply;
    })
    .post('/tasks', { preValidation: app.authenticate }, async (req, reply) => {
      try {
        // TODO: Type cohersion
        const statusId = Number(req.body.data.statusId);
        const executorId = Number(req.body.data.executorId);
        const labelIds = normalizeMultiSelect(req.body.data.labelIds);

        await app.objection.models.task.transaction(async (trx) => {
          await app.objection.models.task.query(trx).insertGraph({
            statusId,
            executorId,
            creatorId: req.user.id,
            name: req.body.data.name,
            labels: labelIds.map((l) => ({ id: l })),
          },
          { relate: true });
          // NOTE: Batch insert, works only for postgres and sql server
          // const task = await app.objection.models.task.query(trx).insert(formData);
          // await task.$relatedQuery('labels', trx).relate(labelIds);
        });
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch (data) {
        const statuses = await app.objection.models.status.query();
        const executors = await app.objection.models.user.query();
        const labels = await app.objection.models.label.query();

        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.render('tasks/new', {
          task: req.body.data,
          statuses: statuses.map((s) => ({ value: s.id, label: s.name })),
          executors: executors.map((e) => ({ value: e.id, label: e.fullName() })),
          labels: labels.map((e) => ({ value: e.id, label: e.name })),
          errors: data,
        });
        return reply;
      }
    })
    .get('/tasks/:id/edit', { name: 'editTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const task = await app.objection.models.task.query().findById(id).withGraphJoined('[labels]');
      const statuses = await app.objection.models.status.query();
      const executors = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();

      task.$set({ labelIds: task.labels.map((label) => label.id) });
      reply.render('tasks/edit', {
        task,
        statuses: statuses.map((s) => ({ value: s.id, label: s.name })),
        executors: executors.map((e) => ({ value: e.id, label: e.fullName() })),
        labels: labels.map((e) => ({ value: e.id, label: e.name })),
      });
      return reply;
    })
    .patch('/tasks/:id', { name: 'updateTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const statusId = Number(req.body.data.statusId);
      const executorId = Number(req.body.data.executorId);
      const labelIds = normalizeMultiSelect(req.body.data.labelIds);
      const { name } = req.body.data;

      try {
        await app.objection.models.task.transaction(async (trx) => {
          await app.objection.models.task.query(trx).upsertGraph({
            id: Number(id),
            creatorId: req.user.id,
            statusId,
            executorId,
            name,
            labels: labelIds.map((l) => ({ id: l })),
          },
          { relate: true, unrelate: true, noDelete: true });
        });

        req.flash('info', i18next.t('flash.tasks.edit.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch ({ data }) {
        const task = await app.objection.models.task.query().findById(id);
        const statuses = await app.objection.models.status.query();
        const executors = await app.objection.models.user.query();
        const labels = await app.objection.models.label.query();

        task.$set({
          name, statusId, executorId, labels: labelIds,
        });
        req.flash('error', i18next.t('flash.tasks.edit.error'));
        req.body.data.id = id;
        reply.render('tasks/edit', {
          task,
          statuses: statuses.map((s) => ({ value: s.id, label: s.name })),
          executors: executors.map((e) => ({ value: e.id, label: e.fullName() })),
          labels: labels.map((e) => ({ value: e.id, label: e.name })),

          errors: data,
        });
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
