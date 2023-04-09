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
  AWS_S3_BUCKET: Joi.string(),
  AWS_ACCESS_KEY: Joi.string(),
  AWS_SECRET_ACCESS_KEY: Joi.string(),
  AWS_REGION: Joi.string(),
  AWS_S3_BUCKET_URL: Joi.string(),
});
