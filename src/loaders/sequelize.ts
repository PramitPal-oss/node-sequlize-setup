import { env } from '@config/env';
import { logger } from '@utils/logger';
import { sequelize } from 'models';

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected successfully');
    await sequelize.sync({
      alter: env.NODE_ENV === 'development',
    });
  } catch (error) {
    console.log(error);
    logger.error('Database connection failed');
    process.exit(1);
  }
};
