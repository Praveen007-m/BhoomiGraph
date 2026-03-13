"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = exports.validateAll = exports.validate = exports.validateParams = exports.validateQuery = exports.validateBody = void 0;
const joi_1 = __importDefault(require("joi"));
const apiResponse_1 = require("../utils/apiResponse");
/**
 * Validate request body against a Joi schema
 */
const validateBody = (schema) => {
    return (0, exports.validate)(schema, 'body');
};
exports.validateBody = validateBody;
/**
 * Validate request query parameters against a Joi schema
 */
const validateQuery = (schema) => {
    return (0, exports.validate)(schema, 'query');
};
exports.validateQuery = validateQuery;
/**
 * Validate request URL parameters against a Joi schema
 */
const validateParams = (schema) => {
    return (0, exports.validate)(schema, 'params');
};
exports.validateParams = validateParams;
/**
 * Validate multiple parts of the request
 */
const validate = (schema, type) => {
    return (req, res, next) => {
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
            return apiResponse_1.ApiResponse.validationError(res, 'Validation failed', errors);
        }
        // Store validated data
        if (type === 'body') {
            req.validatedBody = value;
        }
        else if (type === 'query') {
            req.validatedQuery = value;
        }
        else if (type === 'params') {
            req.validatedParams = value;
        }
        next();
    };
};
exports.validate = validate;
/**
 * Combined validation for multiple parts
 */
const validateAll = (schemas) => {
    return (req, res, next) => {
        const errors = [];
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
            }
            else {
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
            }
            else {
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
            }
            else {
                req.validatedParams = paramsValue;
            }
        }
        if (errors.length > 0) {
            return apiResponse_1.ApiResponse.validationError(res, 'Validation failed', errors);
        }
        next();
    };
};
exports.validateAll = validateAll;
/**
 * Common validation schemas
 */
exports.schemas = {
    // UUID validation
    uuid: joi_1.default.string().uuid().message('Invalid UUID format'),
    // Pagination
    pagination: joi_1.default.object({
        page: joi_1.default.number().integer().min(1).default(1),
        limit: joi_1.default.number().integer().min(1).max(100).default(10),
        sort: joi_1.default.string().optional(),
        order: joi_1.default.string().valid('ASC', 'DESC').default('ASC')
    }),
    // ID parameter
    idParam: joi_1.default.object({
        id: joi_1.default.string().uuid().required()
    }),
    // File upload
    fileUpload: joi_1.default.object({
        file: joi_1.default.any().required()
    })
};
exports.default = exports.validateBody;
