import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';

/**
 * Validation Middleware
 * 
 * Provides request validation using Joi schemas.
 * Validates body, query, and params against defined schemas.
 */

// Extend Express Request to include validated data
export interface ValidatedRequest extends Request {
  validatedBody?: any;
  validatedQuery?: any;
  validatedParams?: any;
}

/**
 * Validate request body against a Joi schema
 */
export const validateBody = (schema: Joi.ObjectSchema) => {
  return validate(schema, 'body');
};

/**
 * Validate request query parameters against a Joi schema
 */
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return validate(schema, 'query');
};

/**
 * Validate request URL parameters against a Joi schema
 */
export const validateParams = (schema: Joi.ObjectSchema) => {
  return validate(schema, 'params');
};

/**
 * Validate multiple parts of the request
 */
export const validate = (schema: Joi.ObjectSchema, type: 'body' | 'query' | 'params') => {
  return (req: ValidatedRequest, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[type], {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, '')
      }));

      return ApiResponse.validationError(
        res,
        'Validation failed',
        errors
      );
    }

    // Store validated data
    if (type === 'body') {
      req.validatedBody = value;
    } else if (type === 'query') {
      req.validatedQuery = value;
    } else if (type === 'params') {
      req.validatedParams = value;
    }

    next();
  };
};

/**
 * Combined validation for multiple parts
 */
export const validateAll = (schemas: {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}) => {
  return (req: ValidatedRequest, res: Response, next: NextFunction) => {
    const errors: Array<{ field: string; message: string }> = [];

    // Validate body
    if (schemas.body) {
      const { error: bodyError, value: bodyValue } = schemas.body.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      if (bodyError) {
        bodyError.details.forEach(detail => {
          errors.push({
            field: `body.${detail.path.join('.')}`,
            message: detail.message.replace(/"/g, '')
          });
        });
      } else {
        req.validatedBody = bodyValue;
      }
    }

    // Validate query
    if (schemas.query) {
      const { error: queryError, value: queryValue } = schemas.query.validate(req.query, {
        abortEarly: false,
        stripUnknown: true
      });

      if (queryError) {
        queryError.details.forEach(detail => {
          errors.push({
            field: `query.${detail.path.join('.')}`,
            message: detail.message.replace(/"/g, '')
          });
        });
      } else {
        req.validatedQuery = queryValue;
      }
    }

    // Validate params
    if (schemas.params) {
      const { error: paramsError, value: paramsValue } = schemas.params.validate(req.params, {
        abortEarly: false,
        stripUnknown: true
      });

      if (paramsError) {
        paramsError.details.forEach(detail => {
          errors.push({
            field: `params.${detail.path.join('.')}`,
            message: detail.message.replace(/"/g, '')
          });
        });
      } else {
        req.validatedParams = paramsValue;
      }
    }

    if (errors.length > 0) {
      return ApiResponse.validationError(
        res,
        'Validation failed',
        errors
      );
    }

    next();
  };
};

/**
 * Common validation schemas
 */
export const schemas = {
  // UUID validation
  uuid: Joi.string().uuid().message('Invalid UUID format'),

  // Pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().optional(),
    order: Joi.string().valid('ASC', 'DESC').default('ASC')
  }),

  // ID parameter
  idParam: Joi.object({
    id: Joi.string().uuid().required()
  }),

  // File upload
  fileUpload: Joi.object({
    file: Joi.any().required()
  })
};

export default validateBody;

