"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllerWrapper = exports.asyncHandler = exports.ApiResponse = void 0;
class ApiResponse {
    /**
     * Send a success response
     */
    static success(res, message = 'Success', data = null, statusCode = 200) {
        const response = {
            success: true,
            message,
            data
        };
        return res.status(statusCode).json(response);
    }
    /**
     * Send a created response (201)
     */
    static created(res, message = 'Resource created successfully', data = null) {
        return this.success(res, message, data, 201);
    }
    /**
     * Send an updated response (200)
     */
    static updated(res, message = 'Resource updated successfully', data = null) {
        return this.success(res, message, data, 200);
    }
    /**
     * Send a deleted response (200)
     */
    static deleted(res, message = 'Resource deleted successfully') {
        return this.success(res, message, null, 200);
    }
    /**
     * Send a paginated success response
     */
    static paginated(res, data, page = 1, limit = 10, total = 0, message = 'Data retrieved successfully') {
        const response = {
            success: true,
            message,
            data,
            meta: {
                page: Number(page),
                limit: Number(limit),
                total: Number(total),
                totalPages: Math.ceil(total / limit)
            }
        };
        return res.status(200).json(response);
    }
    /**
     * Send an error response
     */
    static error(res, message = 'An error occurred', statusCode = 500, errors) {
        const response = {
            success: false,
            message,
            errors
        };
        return res.status(statusCode).json(response);
    }
    /**
     * Send a bad request response (400)
     */
    static badRequest(res, message = 'Bad request', errors) {
        return this.error(res, message, 400, errors);
    }
    /**
     * Send an unauthorized response (401)
     */
    static unauthorized(res, message = 'Unauthorized access') {
        return this.error(res, message, 401);
    }
    /**
     * Send a forbidden response (403)
     */
    static forbidden(res, message = 'Access forbidden') {
        return this.error(res, message, 403);
    }
    /**
     * Send a not found response (404)
     */
    static notFound(res, message = 'Resource not found') {
        return this.error(res, message, 404);
    }
    /**
     * Send a conflict response (409)
     */
    static conflict(res, message = 'Resource already exists') {
        return this.error(res, message, 409);
    }
    /**
     * Send a validation error response (422)
     */
    static validationError(res, message = 'Validation failed', errors) {
        return this.error(res, message, 422, errors);
    }
    /**
     * Send a too many requests response (429)
     */
    static tooManyRequests(res, message = 'Too many requests, please try again later') {
        return this.error(res, message, 429);
    }
    /**
     * Send a service unavailable response (503)
     */
    static serviceUnavailable(res, message = 'Service temporarily unavailable') {
        return this.error(res, message, 503);
    }
}
exports.ApiResponse = ApiResponse;
/**
 * Async handler wrapper to catch errors
 * Use this to wrap async route handlers
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
/**
 * Wrapper for controller methods to handle errors consistently
 */
const controllerWrapper = (controller) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            yield controller(req, res);
        }
        catch (error) {
            console.error(`Controller Error: ${error.message}`);
            // Handle known error types
            if (error.name === 'ValidationError') {
                return ApiResponse.validationError(res, error.message, (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((e) => ({
                    field: e.path,
                    message: e.message
                })));
            }
            if (error.name === 'SequelizeUniqueConstraintError') {
                return ApiResponse.conflict(res, 'Resource already exists');
            }
            if (error.name === 'SequelizeDatabaseError') {
                return ApiResponse.error(res, 'Database error', 500);
            }
            // Default to internal server error
            return ApiResponse.error(res, error.message || 'Internal Server Error', 500);
        }
    });
};
exports.controllerWrapper = controllerWrapper;
exports.default = ApiResponse;
