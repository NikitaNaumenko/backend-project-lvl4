// @ts-check

// import fs from 'fs';
// import path from 'path';
import faker from 'faker'

export const generateUser = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  password: 'password',
});

export const insertUser = (app, form) => app.objection.models.user.query().insert(form);

export const auth = async (app, user) => {
  const responseSignIn = await app.inject({
    method: 'POST',
    url: app.reverse('session'),
    payload: {
      data: { email: user.email, password: 'password' },
    },
  });

  const [sessionCookie] = responseSignIn.cookies;
  const { name, value } = sessionCookie;
  const cookie = { [name]: value };
  return cookie;
};
