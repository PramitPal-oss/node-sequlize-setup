import { NextFunction } from 'express';
import Joi from 'joi';

export const userSchemaCreate = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().alphanum(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  email: Joi.string().email().required(),
  first_name: Joi.string().max(100).pattern(new RegExp("^[A-Za-z]+([ '-.][A-Za-z]+)*$")).required(),
  last_name: Joi.string().max(100).pattern(new RegExp("^[A-Za-z]+([ '-.][A-Za-z]+)*$")).required(),
  phone: Joi.string().pattern(new RegExp('^[0-9()+-\\s]{7,20}$')).optional().allow(null),
  address: Joi.string().max(255).optional(),
  app_ids: Joi.array().min(1).items(Joi.number().integer().positive()).required(),
});

export const userSchemaUpdate = Joi.object({
  username: Joi.string().alphanum().min(3).max(30),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  email: Joi.string().email(),
  birthdate: Joi.date().less('now'),
});

export const validateRequest = (validationschema: Joi.ObjectSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = validationschema.required().validate(req.body, { abortEarly: false });

    if (error) {
      error.isJoi = true; // so globalErrorHandler can detect it
      return next(error);
    }
    next();
  };
};
