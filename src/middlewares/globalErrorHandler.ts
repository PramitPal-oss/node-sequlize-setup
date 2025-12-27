import { AppError } from '@utils/AppError';
import { logger } from '@utils/logger';
import { NextFunction, Request, Response } from 'express';
import { ValidationError as JoiError } from 'joi';
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';
import { BaseError, UniqueConstraintError, ValidationError } from 'sequelize';

export const globalErrorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  let statusCode: number = 500;
  let message: string = 'Internal Server Error';
  let errorStack: string = '';
  let name: string = 'Error';

  // 1️⃣ Joi validation error
  if (err instanceof JoiError) {
    statusCode = 400;
    message = err.details.map((d) => d.message).join(', ');
    errorStack = err.stack || '';
    name = err.name;
  }

  //2️⃣ JWT errors
  else if (err instanceof TokenExpiredError) {
    statusCode = 401;
    message = 'Token expired. Please login again.';
    name = err.name;
    errorStack = err.stack || '';
  } else if (err instanceof JsonWebTokenError) {
    statusCode = 401;
    message = 'Invalid token. Please login again.';
    name = err.name;
    errorStack = err.stack || '';
  } else if (err instanceof NotBeforeError) {
    statusCode = 401;
    message = 'Token not active yet.';
    name = err.name;
    errorStack = err.stack || '';
  }

  // 3️⃣ Sequelize validation error
  else if (err instanceof ValidationError && err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = err.errors?.map((e) => e.message).join(', ');
    errorStack = err.stack || '';
    name = err.name;
  }

  // 4️⃣ Sequelize unique constraint error
  else if (err instanceof UniqueConstraintError && err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = err.errors.map((e) => e.message).join(', ');
    errorStack = err.stack || '';
    name = err.name;
  }

  // 5️⃣ Sequelize DB errors (FK, syntax, etc)
  else if (err instanceof BaseError && err.name.startsWith('Sequelize')) {
    statusCode = 400;
    message = err.message;
    errorStack = err.stack || '';
    name = err.name;
  }

  // 6️⃣ Custom application error
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorStack = err.stack || '';
    name = err.name;
  }

  logger.error({
    message,
    stack: errorStack,
    name,
  });

  res.status(statusCode).json({
    success: false,
    message,
    name,
    errorStack,
  });
};
