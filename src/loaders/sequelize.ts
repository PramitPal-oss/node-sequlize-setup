import { sequelize } from '@config/database';
import { logger } from '@utils/logger';

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected successfully');
    // await sequelize.sync();
  } catch (error: any) {
    console.log(error);
    logger.error('Database connection failed', {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

/**
 {
      alter: env.NODE_ENV === 'development',
    }
 */
