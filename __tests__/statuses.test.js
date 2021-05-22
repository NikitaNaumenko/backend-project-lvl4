import { auth, factories, launchApp, shutdownApp, databaseHelpers } from './helpers/index.js';

describe('test CRUD', () => {
  let app;
  let cookie;

  beforeAll(async () => {
    app = await launchApp();
    const result = await auth(app);
    cookie = result.cookie;
  });

  it('index', async () => {
    const res = await app.inject({
      method: 'GET',
      url: app.reverse('statuses'),
      cookies: cookie
    });

    expect(res.statusCode).toBe(200);
  });

  it('new', async () => {
    const res = await app.inject({
      method: 'GET',
      url: app.reverse('newStatus'),
      cookies: cookie,
    });

    expect(res.statusCode).toBe(200);
  });

  it('edit', async () => {
    const statusData = factories.status();
    const status = await databaseHelpers(app).insert.status(statusData);
    const res = await app.inject({
      method: 'GET',
      url: app.reverse('editStatus', { id: status.id }),
      cookies: cookie,
    });

    expect(res.statusCode).toBe(200);
  });

  it('update', async () => {
    const statusData = factories.status();
    const newStatusData = factories.status();
    const status = await databaseHelpers(app).insert.status(statusData);

    const res = await app.inject({
      method: 'PATCH',
      url: app.reverse('updateStatus', { id: status.id }),
      cookies: cookie,
      body: { data: newStatusData },
    });

    expect(res.statusCode).toBe(302);
  });

  it('create', async () => {
    const statusData = factories.status();
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('statuses'),
      cookies: cookie,
      body: {
        data: statusData,
      },
    });

    expect(response.statusCode).toBe(302);
    const createdStatus = await databaseHelpers(app).findOne.status({ name: statusData.name });
    expect(createdStatus).toMatchObject(statusData);
  });

  it('delete', async () => {
    const statusData = factories.status();
    const status = await databaseHelpers(app).insert.status(statusData);

    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteStatus', { id: status.id }),
      cookies: cookie,
    })

    expect(response.statusCode).toBe(302);
    const deletedStatus = await databaseHelpers(app).findOne.status({ id: status.id });
    expect(deletedStatus).toBeUndefined();
  });

  afterAll(async () => {
    await shutdownApp(app)
  });
});
