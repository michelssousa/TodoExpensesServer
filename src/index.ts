import { schema } from '@src/entryPoints';
import { logger, msg } from '@src/shared';
import config from 'config';
import cors from 'cors';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';

export const main = async (): Promise<void> => {
  try {
    const app = express();
    const port = parseInt(config.get('App.port'));

    app.use(cors());
    app.use(express.json());
    app.use(
      '/graphql',
      graphqlHTTP({
        schema,
        graphiql: true,
      })
    );

    //database();

    app.listen(port, () => {
      logger.info(msg.success.serverOn(port));
    });
  } catch (error) {
    logger.error(msg.error.serverOn(error));
  }
};
