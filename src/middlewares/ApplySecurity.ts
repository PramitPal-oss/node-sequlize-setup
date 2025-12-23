// src/middleware/security.js
import compression from 'compression';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';

export const applySecurity = (app: Express) => {
  // basic protections
  app.disable('x-powered-by');
  app.use(helmet());

  // CSP example (tighten gradually as needed)
  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        'default-src': ["'self'"],
        'img-src': ["'self'", 'data:'],
        'object-src': ["'none'"],
        'upgrade-insecure-requests': [],
      },
    }),
  );

  // CORS
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(',') || '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
    }),
  );

  // Body parsing + size limits + enforce JSON
  app.use(express.json({ limit: '50kb', type: 'application/json' }));
  app.use(express.urlencoded({ extended: true, limit: '50kb' }));

  // Sanitizers
  // app.use(mongoSanitize());
  // app.use(xssClean());

  // Prevent HTTP Parameter Pollution
  app.use(hpp());

  // Gzip
  app.use(compression());
};
