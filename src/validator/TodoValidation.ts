import Joi from 'joi';

export const todoSchemaCreate = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(3).required(),

  status: Joi.string().valid(1, 2, 3).default(1).messages({
    'any.only': 'Status must be 1 , 2 or 3',
    'any.required': 'Status is required',
  }),

  priority: Joi.string().valid(1, 2, 3).default(2).messages({
    'any.only': 'Status must be 1 , 2 or 3',
    'any.required': 'priority is required',
  }),
});

export const todoSchemaUpdate = todoSchemaCreate.min(1);
