import { env } from '@config/env';
import { connectDB } from '@loaders/sequelize';
import { logger } from '@utils/logger';
import { app } from './app';

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
  });
};

startServer();
