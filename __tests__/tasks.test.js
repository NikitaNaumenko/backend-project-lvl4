import _ from 'lodash';
import {
  auth, factories, launchApp, shutdownApp, databaseHelpers,
} from './helpers/index.js';

describe('test CRUD', () => {
  let app;
  let cookie;
  let status;
  let label;
  let currentUser;

  beforeAll(async () => {
    app = await launchApp();
    const result = await auth(app);
    cookie = result.cookie;
    currentUser = result.user;
    const statusData = factories.status();
    status = await databaseHelpers(app).insert.status(statusData);
    const labelData = factories.label();
    label = await databaseHelpers(app).insert.status(labelData);
  });

  afterAll(async () => {
    await shutdownApp(app);
  });

  it('index', async () => {
    const res = await app.inject({
      method: 'GET',
      url: app.reverse('tasks'),
      cookies: cookie,
    });

    expect(res.statusCode).toBe(200);
  });

  it('show', async () => {
    const taskData = factories.task({ statusId: status.id, creatorId: currentUser.id });
    const task = await databaseHelpers(app).insert.task(taskData);
    const res = await app.inject({
      method: 'GET',
      url: app.reverse('task', { id: task.id }),
      cookies: cookie,
    });

    expect(res.statusCode).toBe(200);
  });

  it('new', async () => {
    const res = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
      cookies: cookie,
    });

    expect(res.statusCode).toBe(200);
  });

  it('edit', async () => {
    const taskData = factories.task({ statusId: status.id, creatorId: currentUser.id });
    const task = await databaseHelpers(app).insert.task(taskData);
    const res = await app.inject({
      method: 'GET',
      url: app.reverse('editTask', { id: task.id }),
      cookies: cookie,
    });

    expect(res.statusCode).toBe(200);
  });

  it('update', async () => {
    const taskData = factories.task({
      statusId: status.id,
      creatorId: currentUser.id,
    });
    const newTaskData = factories.task({ statusId: status.id, executorId: currentUser.id, labelIds: [label.id] });
    const task = await databaseHelpers(app).insert.task(taskData);

    const res = await app.inject({
      method: 'PATCH',
      url: app.reverse('updateTask', { id: task.id }),
      cookies: cookie,
      body: { data: newTaskData },
    });

    expect(res.statusCode).toBe(302);
  });

  it('create', async () => {
    const taskData = factories.task({
      statusId: status.id,
      executorId: currentUser.id,
      labelIds: [label.id],
    });

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      cookies: cookie,
      body: {
        data: taskData,
      },
    });

    expect(response.statusCode).toBe(302);
    const createdTask = await databaseHelpers(app).findOne.task({ name: taskData.name });
    expect(createdTask).toMatchObject(_.omit(taskData, 'labelIds'));
  });

  it('delete', async () => {
    const taskData = factories.task({ statusId: status.id, creatorId: currentUser.id });
    const task = await databaseHelpers(app).insert.task(taskData);

    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteTask', { id: task.id }),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const deletedTask = await databaseHelpers(app).findOne.task({ id: task.id });
    expect(deletedTask).toBeUndefined();
  });
});
