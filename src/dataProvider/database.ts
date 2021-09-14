import {BaseRespositories, DB} from '@src/core/database';
import {Repositories} from '@src/dataProvider/repositories';
import {logger} from '@src/shared';
import msg from '@src/shared/menssage';
import knex, {Knex} from 'knex';

const config: any = require('./knexfile')['development'];

const db: Knex = knex(config);

const tables = {
  users: 'users',
  categories: 'categories',
  transactions: 'transactions',
  knexMigration: 'knex_migrations',
  knexMigrationLock: 'knex_migrations_lock',
};

const Database: DB = {
  tables: db,
  start: async (): Promise<void> => {
    try {
      await db.migrate
        .latest()
        .then(() => {
          logger.info(msg.success.migrate);
        })
        .catch((err) => {
          logger.error(`${msg.error.migrate} => ${err}`);
        });
      await db.seed
        .run()
        .then(() => {
          logger.info(msg.success.seed);
        })
        .catch((err) => {
          logger.error(`${msg.error.seed} => ${err}`);
        });
      logger.info(msg.success.database);
    } catch {
      logger.error(msg.error.database);
    }
  },
  destroy: async (): Promise<void> => {
    try {
      await db.destroy();
    } catch (error) {
      logger.error(msg.error.databaseClose);
    }
  },
  dropTables: async (): Promise<void> => {
    try {
      await db.migrate.rollback().then(() => db.migrate.latest());
    } catch (err) {
      logger.error(`${msg.error.migrate} => ${err}`);
    }
  },
  fake: async (): Promise<void> => {
    try {
      await db.seed.run().then(() => logger.info(msg.success.seed));
    } catch (err) {
      logger.error(`${msg.error.seed} => ${err}`);
    }
  },
  respositories: (): BaseRespositories => {
    const repoOrError = Repositories.make();

    if (repoOrError.isFailure) {
      throw new Error(msg.error.failingOperation);
    }
    const repo = repoOrError.getValue();

    return repo;
  },
};

export {tables, Database};
