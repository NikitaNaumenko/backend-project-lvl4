import faker from 'faker';
import _ from 'lodash';

export default {
  status: (data = {}) => (_.merge({ name: faker.name.title() }, { ...data })),
  user: (data = {}) => (_.merge({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }, { ...data })),
};
