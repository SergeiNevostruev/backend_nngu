import { Joi } from 'express-validation';

export const createValidation = {
  body: Joi.object({
    header: Joi.string().min(4).required(),
    content: Joi.string().min(4).required(),
  }),
};

export const updateValidation = {
  body: Joi.object({
    header: Joi.string().min(4).required(),
    content: Joi.string().min(4).required(),
  }),
};
