// @ts-check

const path = require('path');

const migrations = {
  directory: path.join(__dirname, 'server', 'migrations'),
};

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './database.sqlite',
    },
    useNullAsDefault: true,
    migrations,
  },
  test: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
    migrations,
  },
  production: {
    client: 'sqlite3',
    connection: {
      filename: './database.sqlite',
    },
    useNullAsDefault: true,
    migrations,
  },
};
// module.exports = {
//   development: {
//     client: 'pg',
//     connection: {
//       host: '127.0.0.1',
//       user: 'postgres',
//       password: 'postgres',
//       database: 'project-lvl-4-dev',
//     },
//     useNullAsDefault: true,
//     migrations,
//   },
//   test: {
//     client: 'pg',
//     connection: {
//       host: '127.0.0.1',
//       user: 'postgres',
//       password: 'postgres',
//       database: 'project-lvl-4-test',
//     },
//     useNullAsDefault: true,
//     migrations,
//   },
//   production: {
//     client: 'pg',
//     connection: {
//       filename: './database.sqlite',
//     },
//     useNullAsDefault: true,
//     migrations,
//   },
// };
