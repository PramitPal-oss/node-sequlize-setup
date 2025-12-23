import { logger } from '@utils/logger';
import { NextFunction, Request, Response } from 'express';
import { ValidationError as JoiError } from 'joi';
import { BaseError } from 'sequelize';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // 1️⃣ Joi validation error
  if (err instanceof JoiError) {
    statusCode = 400;
    message = err.details.map((d) => d.message).join(', ');
  }

  // 2️⃣ Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = err.errors.map((e: any) => e.message).join(', ');
  }

  // 3️⃣ Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = err.errors.map((e: any) => e.message).join(', ');
  }

  // 4️⃣ Sequelize DB errors (FK, syntax, etc)
  if (err instanceof BaseError) {
    statusCode = 400;
    message = err.message;
  }

  logger.error({
    message: err.message,
    stack: err,
    name: err.name,
  });

  res.status(statusCode).json({
    success: false,
    message,
  });
};
