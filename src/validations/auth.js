import { Joi } from 'express-validation';

export const signinValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{8,30}/)
      .required(),
  }),
};

export const signupValidation = {
  body: Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{8,30}/)
      .required(),
  }),
};
