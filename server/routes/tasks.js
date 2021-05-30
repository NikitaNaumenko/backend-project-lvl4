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
      const task = await app.objection.models.task.query()
        .withGraphJoined('[creator, executor, status, labels]')
        .findById(id);

      reply.render('tasks/show', { task });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask', preValidation: app.authenticate }, async (_req, reply) => {
      const [task, statuses, executors, labels] = await Promise.all([
        await new app.objection.models.task(),
        await app.objection.models.status.query(),
        await app.objection.models.user.query(),
        await app.objection.models.label.query(),
      ]);
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
      const { name, description } = req.body.data;
      const creatorId = req.user.id;

      try {
        await app.objection.models.task.transaction(async (trx) => {
          await app.objection.models.task.query(trx).insertGraph({
            statusId,
            executorId,
            creatorId,
            name,
            description,
            labels: labelIds.map((id) => ({ id })),
          }, { relate: true });
        });
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch ({ data }) {
        const [statuses, executors, labels, task] = await Promise.all([
          await app.objection.models.status.query(),
          await app.objection.models.user.query(),
          await app.objection.models.label.query(),
          await new app.objection.models.task(),
        ]);
        task.$set({
          name,
          description,
          creatorId,
          statusId,
          executorId,
          labelIds,
        });

        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.render('tasks/new', {
          task,
          statuses: selectize(statuses, 'id', 'name'),
          labels: selectize(labels, 'id', 'name'),
          executors: selectize(executors.map((i) => i.toJSON()), 'id', 'fullName'),
          errors: data,
        });
        return reply;
      }
    })
    .get('/tasks/:id/edit', { name: 'editTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const [task, statuses, executors, labels] = await Promise.all([
        await app.objection.models.task.query().findById(id).withGraphJoined('[labels]'),
        await app.objection.models.status.query(),
        await app.objection.models.user.query(),
        await app.objection.models.label.query(),
      ]);

      task.$set({ labels: task.labels.map((label) => label.id) });
      reply.render('tasks/edit', {
        task,
        statuses: selectize(statuses, 'id', 'name'),
        labels: selectize(labels, 'id', 'name'),
        executors: selectize(executors.map((i) => i.toJSON()), 'id', 'fullName'),
      });

      return reply;
    })
    .patch('/tasks/:id', { name: 'updateTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const statusId = Number(req.body.data.statusId);
      const executorId = Number(req.body.data.executorId);
      const labelIds = normalizeMultiSelect(req.body.data.labelIds);
      const { name, description } = req.body.data;
      const creatorId = req.user.id;

      try {
        await app.objection.models.task.transaction(async (trx) => {
          await app.objection.models.task.query(trx).upsertGraph({
            id: Number(id),
            creatorId,
            statusId,
            executorId,
            name,
            description,
            labels: labelIds.map((labelId) => ({ id: labelId })),
          },
          { relate: true, unrelate: true, noDelete: true });
        });

        req.flash('info', i18next.t('flash.tasks.edit.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch ({ data }) {
        const [task, statuses, executors, labels] = await Promise.all([
          await app.objection.models.task.query().findById(id),
          await app.objection.models.status.query(),
          await app.objection.models.user.query(),
          await app.objection.models.label.query(),
        ]);

        task.$set({
          name, statusId, description, executorId, labels: labelIds,
        });
        req.flash('error', i18next.t('flash.tasks.edit.error'));
        // req.body.data.id = id;
        reply.render('tasks/edit', {
          task,
          statuses: selectize(statuses, 'id', 'name'),
          labels: selectize(labels, 'id', 'name'),
          executors: selectize(executors.map((i) => i.toJSON()), 'id', 'fullName'),
          errors: data,
        });
        return reply;
      }
    })
    .delete('/tasks/:id', { name: 'deleteTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;

      try {
        const task = await app.objection.models.task.query().findById(id);

        if (req.user.id !== task.creatorId) {
          req.flash('error', i18next.t('flash.tasks.delete.error'));
          reply.redirect(app.reverse('tasks'));
          return reply;
        }

        await app.objection.models.task.transaction(async (trx) => {
          await task.$relatedQuery('labels', trx).unrelate();
          await task.$query(trx).delete();
        });

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
