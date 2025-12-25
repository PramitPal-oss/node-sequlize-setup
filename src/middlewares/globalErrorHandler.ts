import { AppError } from '@utils/AppError';
import { logger } from '@utils/logger';
import { NextFunction, Request, Response } from 'express';
import { ValidationError as JoiError } from 'joi';
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

  // 2️⃣ Sequelize validation error
  else if (err instanceof ValidationError && err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = err.errors?.map((e) => e.message).join(', ');
    errorStack = err.stack || '';
    name = err.name;
  }

  // 3️⃣ Sequelize unique constraint error
  else if (err instanceof UniqueConstraintError && err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = err.errors.map((e) => e.message).join(', ');
    errorStack = err.stack || '';
    name = err.name;
  }

  // 4️⃣ Sequelize DB errors (FK, syntax, etc)
  else if (err instanceof BaseError && err.name.startsWith('Sequelize')) {
    statusCode = 400;
    message = err.message;
    errorStack = err.stack || '';
    name = err.name;
  }

  // 5️⃣ Custom application error
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
