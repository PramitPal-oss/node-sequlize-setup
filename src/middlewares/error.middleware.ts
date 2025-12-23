import { logger } from '@utils/logger';
import { NextFunction, Request, Response } from 'express';

export const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {
  logger.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
};
