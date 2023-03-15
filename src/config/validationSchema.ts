import * as Joi from 'joi';

export const validationSchema = Joi.object({
  DATABASE_HOST: Joi.string(),
  DATABASE_PORT: Joi.string(),
});
