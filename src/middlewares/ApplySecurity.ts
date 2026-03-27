// src/middleware/security.js
import { env } from '@config/env';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';

export const applySecurity = (app: Express) => {
  console.log(env.CORS_ORIGIN);
  app.disable('x-powered-by');

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:'],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
    }),
  );

  app.use(
    cors({
      origin: env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',') : false,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    }),
  );

  app.use(express.json({ limit: '50kb' }));
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true, limit: '50kb' }));

  app.use(hpp());
  app.use(compression());
};
