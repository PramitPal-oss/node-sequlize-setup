import { sequelize } from '@config/database';
import { logger } from '@utils/logger';

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected successfully');
    // await sequelize.sync();
  } catch (error: unknown) {
    console.log(error);
    logger.error('Database connection failed', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  }
};

/**
 {
      alter: env.NODE_E NV === 'development',
    }
 */
