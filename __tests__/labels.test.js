import {
  auth, factories, launchApp, shutdownApp, databaseHelpers,
} from './helpers/index.js';

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
      url: app.reverse('labels'),
      cookies: cookie,
    });

    expect(res.statusCode).toBe(200);
  });

  it('new', async () => {
    const res = await app.inject({
      method: 'GET',
      url: app.reverse('newLabel'),
      cookies: cookie,
    });

    expect(res.statusCode).toBe(200);
  });

  it('edit', async () => {
    const labelData = factories.label();
    const label = await databaseHelpers(app).insert.label(labelData);
    const res = await app.inject({
      method: 'GET',
      url: app.reverse('editLabel', { id: label.id }),
      cookies: cookie,
    });

    expect(res.statusCode).toBe(200);
  });

  it('update', async () => {
    const labelData = factories.label();
    const newLabelData = factories.label();
    const label = await databaseHelpers(app).insert.label(labelData);

    const res = await app.inject({
      method: 'PATCH',
      url: app.reverse('updateLabel', { id: label.id }),
      cookies: cookie,
      body: { data: newLabelData },
    });

    expect(res.statusCode).toBe(302);
  });

  it('create', async () => {
    const labelData = factories.label();
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('labels'),
      cookies: cookie,
      body: {
        data: labelData,
      },
    });

    expect(response.statusCode).toBe(302);
    const createdLabel = await databaseHelpers(app).findOne.label({ name: labelData.name });
    expect(createdLabel).toMatchObject(labelData);
  });

  it('delete', async () => {
    const labelData = factories.label();
    const label = await databaseHelpers(app).insert.label(labelData);

    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteLabel', { id: label.id }),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const deletedLabel = await databaseHelpers(app).findOne.label({ id: label.id });
    expect(deletedLabel).toBeUndefined();
  });

  afterAll(async () => {
    await shutdownApp(app);
  });
});
