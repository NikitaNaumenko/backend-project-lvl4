// @ts-check

const path = require('path');

const migrations = {
  directory: path.join(__dirname, 'server', 'migrations'),
};

console.log(process.env.DATABASE_URL);
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: '0.0.0.0',
      port: '5432',
      user: 'postgres',
      password: 'postgres',
      database: 'project-lvl-4-dev',
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
    connection: process.env.DATABASE_URL,
    // connection: {
    //   host: process.env.DATABASE_HOST,
    //   port: process.env.DATABASE_PORT,
    //   user: process.env.DATABASE_USER,
    //   password: process.env.DATABASE_PASSWORD,
    //   database: process.env.DATABASE_NAME,
    //   ssl: { rejectUnauthorized: false },
    // },
    ssl: { rejectUnauthorized: false },
    useNullAsDefault: true,
    migrations,
  },
};
