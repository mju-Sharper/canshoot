import * as Joi from 'joi';

export const validationSchema = Joi.object({
  DB_HOST: Joi.string(),
  DB_PORT: Joi.string(),
  DB_USERNAME: Joi.string(),
  DB_PASSWORD: Joi.string(),
  DB_DATABASE: Joi.string(),
  CONTAINER_PORT: Joi.string(),
  JWT_ACCESSTOKEN_SECRET: Joi.string(),
  JWT_REFRESHTOKEN_SECRET: Joi.string(),
});
