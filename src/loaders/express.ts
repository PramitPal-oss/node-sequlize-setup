import { applySecurity } from '@middlewares/ApplySecurity';
import { globalErrorHandler } from '@middlewares/globalErrorHandler';
import { apiLimiter } from '@middlewares/rateLimit';
import authRoutes from '@routes/authRoutes';
import { httpLogger } from '@utils/httpLogger';
import express from 'express';
import morgan from 'morgan';

export const loadExpress = () => {
  const app = express();
  // Security & parsing
  applySecurity(app);

  app.use(
    morgan('combined', {
      stream: {
        write: (message) => httpLogger.http(message.trim()),
      },
    }),
  );

  // 🌍 Apply to all /api routes
  app.use('/api', apiLimiter);

  app.use('/api/users', authRoutes);

  app.use(globalErrorHandler);

  return app;
};
