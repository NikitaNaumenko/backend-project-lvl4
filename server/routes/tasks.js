import i18next from 'i18next';
import _ from 'lodash';
import normalizeMultiSelect from '../lib/normalizeMultiSelect.js';

const selectize = (col, val, label) => col.map((item) => ({
  value: item[val],
  label: item[label],
}));

export default (app) => {
  app
    .get('/tasks', { name: 'tasks', preValidation: app.authenticate }, async (req, reply) => {
      const { query: { data = {} } } = req;
      const filter = _.pickBy(data);

      const tasks = await app.objection.models.task.query()
        .skipUndefined()
        .withGraphJoined('[creator, executor, status, labels]')
        .where('statusId', filter.status)
        .where('executorId', filter.executor)
        .where('labels.id', filter.label)
        .where('creatorId', filter.isCreatorUser ? req.user.id : undefined);

      const [statuses, labels, executors] = await Promise.all([
        app.objection.models.status.query(),
        app.objection.models.label.query(),
        app.objection.models.user.query(),
      ]);

      reply.render('tasks/index', {
        tasks,
        filter: {
          status: Number(filter.status),
          executor: Number(filter.executor),
          label: Number(filter.label),
          isCreatorUser: filter.isCreatorUser ? 'on' : null,
        },
        statuses: selectize(statuses, 'id', 'name'),
        labels: selectize(labels, 'id', 'name'),
        executors: selectize(executors.map((i) => i.toJSON()), 'id', 'fullName'),
      });
      return reply;
    })
    .get('/tasks/:id', { name: 'task', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const task = await app.objection.models.task.query().withGraphJoined('[creator, executor, status, labels]').findById(id);
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
      const statusId = Number(req.body.data.statusId);
      const executorId = Number(req.body.data.executorId);
      const labelIds = normalizeMultiSelect(req.body.data.labels);

      try {
        // TODO: Type cohersion
        await app.objection.models.task.transaction(async (trx) => {
          await app.objection.models.task.query(trx).insertGraph({
            statusId,
            executorId,
            creatorId: req.user.id,
            name: req.body.data.name,
            description: req.body.data.description,
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
      } catch ({ data }) {
        const statuses = await app.objection.models.status.query();
        const executors = await app.objection.models.user.query();
        const labels = await app.objection.models.label.query();
        const task = await new app.objection.models.task();
        task.$set({
          statusId,
          executorId,
          name: req.body.data.name,
          labelIds,
          description: req.body.data.description,
        });

        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.render('tasks/new', {
          task,
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

      task.$set({ labels: task.labels.map((label) => label.id) });
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
      const { name, description } = req.body.data;

      try {
        await app.objection.models.task.transaction(async (trx) => {
          await app.objection.models.task.query(trx).upsertGraph({
            id: Number(id),
            creatorId: req.user.id,
            statusId,
            executorId,
            name,
            description,
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
          name, statusId, description, executorId, labels: labelIds,
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
        // const tt = await app.objection.models.task.query().findById(id);
        // console.log(tt);
        // const task = await app.objection.models.task.query().deleteById(id);
        let task;

        await app.objection.models.task.transaction(async (trx) => {
          task = await app.objection.models.task.query(trx).findById(id);
          await task.$relatedQuery('labels', trx).unrelate();
          await task.$query(trx).delete();
          // NOTE: Batch insert, works only for postgres and sql server
          // const task = await app.objection.models.task.query(trx).insert(formData);
          // await task.$relatedQuery('labels', trx).relate(labelIds);
        });

        if (req.user.id !== task.creatorId) {
          req.flash('error', i18next.t('flash.tasks.delete.error'));
          reply.redirect(app.reverse('tasks'));
          return reply;
        }
        req.flash('info', i18next.t('flash.tasks.delete.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch (error) {
        console.log(error);
        req.flash('error', i18next.t('flash.tasks.delete.error'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      }
    });
};
