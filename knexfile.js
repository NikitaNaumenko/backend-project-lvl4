// @ts-check

const path = require('path');

const { knexSnakeCaseMappers } = require('objection');

const migrations = {
  directory: path.join(__dirname, 'server', 'migrations'),
};

module.exports = {
  development: {
    // client: 'pg',
    // connection: {
    //   host: '0.0.0.0',
    //   port: '5432',
    //   user: 'postgres',
    //   password: 'postgres',
    //   database: 'project-lvl-4-dev',
    // },
    // useNullAsDefault: true,
    // migrations,
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
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      ssl: { rejectUnauthorized: false },
    },
    useNullAsDefault: true,
    migrations,
  },
    ...knexSnakeCaseMappers()

};
