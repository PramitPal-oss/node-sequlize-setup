import { sequelize } from '@config/database';
import { logger } from '@utils/logger';

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected successfully');
  } catch (error) {
    console.log(error);
    logger.error('Database connection failed');
    process.exit(1);
  }
};
