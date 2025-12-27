import { applySecurity } from '@middlewares/ApplySecurity';
import { globalErrorHandler } from '@middlewares/globalErrorHandler';
import { apiLimiter } from '@middlewares/rateLimit';
import authRoutes from '@routes/authRoutes';
import todoRoutes from '@routes/todoRoutes';
import { AppError } from '@utils/AppError';
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

  app.use('/api/v1/user', authRoutes);

  app.use('/api/v1/todo', todoRoutes);

  // 404 (must be after routes)
  app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

  app.use(globalErrorHandler);

  return app;
};
