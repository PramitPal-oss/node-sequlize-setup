import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';

export const validate = (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) return next(error);

  next();
};
