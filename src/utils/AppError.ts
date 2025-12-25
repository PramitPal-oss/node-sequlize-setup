export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500, name: string = 'AppError') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.name = name;

    Error.captureStackTrace(this, this.constructor);
  }
}
