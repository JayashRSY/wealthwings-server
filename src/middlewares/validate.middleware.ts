import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { pick } from 'lodash';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

type SchemaType = {
  params?: Joi.Schema;
  query?: Joi.Schema;
  body?: Joi.Schema;
};

/**
 * Middleware to validate request data against a Joi schema
 * @param schema - Joi schema or object containing Joi schemas for params, query, and body
 * @returns Express middleware function
 */
const validate = (schema: SchemaType | Joi.Schema) => (req: Request, res: Response, next: NextFunction) => {
  const validSchema = Joi.isSchema(schema) ? { body: schema } : schema;
  const object = pick(req, Object.keys(validSchema));

  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }

  Object.assign(req, value);
  return next();
};

export default validate;