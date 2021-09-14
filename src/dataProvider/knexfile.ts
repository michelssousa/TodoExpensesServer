// Update with your config settings.

import path from 'path';

const { BD_HOST, BD_NAME, BD_USER, BD_PASSWORD, BD_POOL_MIN, BD_POOL_MAX } =
  process.env;

module.exports = {
  development: {
    client: 'mysql2',
    useNullAsDefault: true,
    connection: {
      host: BD_HOST || '',
      database: BD_NAME || '',
      user: BD_USER || '',
      password: BD_PASSWORD || '',
      charset: 'utf8',
    },
    pool: {
      min: Number(BD_POOL_MIN) || 2,
      max: Number(BD_POOL_MAX) || 6,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(__dirname, 'migrations'),
    },
    seeds: {
      directory: path.resolve(__dirname, 'seeds'),
    },
    debug: false,
  },
};
