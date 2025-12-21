import { errorHandler } from '@middlewares/error.middleware';
import routes from '@routes/index';
import { httpLogger } from '@utils/httpLogger';
import express from 'express';
import morgan from 'morgan';

export const loadExpress = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(errorHandler);

  app.use(
    morgan('combined', {
      stream: {
        write: (message) => httpLogger.http(message.trim()),
      },
    }),
  );

  app.use('/api', routes);

  return app;
};
