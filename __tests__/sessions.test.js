import { auth, launchApp, shutdownApp } from './helpers/index.js';

describe('test session', () => {
  let app;

  beforeAll(async () => {
    app = await launchApp();
  });

  it('test sign in / sign out', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newSession'),
    });

    expect(response.statusCode).toBe(200);

    const { cookie } = await auth(app);

    const responseSignOut = await app.inject({
      method: 'DELETE',
      url: app.reverse('session'),
      cookies: cookie,
    });

    expect(responseSignOut.statusCode).toBe(302);
  });

  afterAll(async () => {
    await shutdownApp(app);
  });
});
