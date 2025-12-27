import Joi from 'joi';

export const userSchemaCreate = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().alphanum(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[^\\w\\s]).{8,}$'))
    .required()
    .messages({
      'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character',
    }),

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
});

export const loginUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().alphanum(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  app_ids: Joi.array().min(1).items(Joi.number().integer().positive()).required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[^\\w\\s]).{8,}$'))
    .required()
    .messages({
      'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character',
    }),

  confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Confirm password must match password',
  }),
});
