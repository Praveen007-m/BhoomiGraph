import { Response } from 'express';

/**
 * Standardized API Response Format
 * 
 * All API responses follow this format for consistency:
 * {
 *   success: boolean,
 *   message: string,
 *   data?: any,
 *   meta?: {
 *     page?: number,
 *     limit?: number,
 *     total?: number
 *   }
 * }
 */

export interface IApiResponse {
  success: boolean;
  message: string;
  data?: any;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: any;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export class ApiResponse {
  /**
   * Send a success response
   */
  static success(
    res: Response,
    message: string = 'Success',
    data: any = null,
    statusCode: number = 200
  ): Response {
    const response: IApiResponse = {
      success: true,
      message,
      data
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send a created response (201)
   */
  static created(
    res: Response,
    message: string = 'Resource created successfully',
    data: any = null
  ): Response {
    return this.success(res, message, data, 201);
  }

  /**
   * Send an updated response (200)
   */
  static updated(
    res: Response,
    message: string = 'Resource updated successfully',
    data: any = null
  ): Response {
    return this.success(res, message, data, 200);
  }

  /**
   * Send a deleted response (200)
   */
  static deleted(
    res: Response,
    message: string = 'Resource deleted successfully'
  ): Response {
    return this.success(res, message, null, 200);
  }

  /**
   * Send a paginated success response
   */
  static paginated(
    res: Response,
    data: any[],
    page: number = 1,
    limit: number = 10,
    total: number = 0,
    message: string = 'Data retrieved successfully'
  ): Response {
    const response: IApiResponse = {
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
  static error(
    res: Response,
    message: string = 'An error occurred',
    statusCode: number = 500,
    errors?: Array<{ field: string; message: string }>
  ): Response {
    const response: IApiResponse = {
      success: false,
      message,
      errors
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send a bad request response (400)
   */
  static badRequest(
    res: Response,
    message: string = 'Bad request',
    errors?: Array<{ field: string; message: string }>
  ): Response {
    return this.error(res, message, 400, errors);
  }

  /**
   * Send an unauthorized response (401)
   */
  static unauthorized(
    res: Response,
    message: string = 'Unauthorized access'
  ): Response {
    return this.error(res, message, 401);
  }

  /**
   * Send a forbidden response (403)
   */
  static forbidden(
    res: Response,
    message: string = 'Access forbidden'
  ): Response {
    return this.error(res, message, 403);
  }

  /**
   * Send a not found response (404)
   */
  static notFound(
    res: Response,
    message: string = 'Resource not found'
  ): Response {
    return this.error(res, message, 404);
  }

  /**
   * Send a conflict response (409)
   */
  static conflict(
    res: Response,
    message: string = 'Resource already exists'
  ): Response {
    return this.error(res, message, 409);
  }

  /**
   * Send a validation error response (422)
   */
  static validationError(
    res: Response,
    message: string = 'Validation failed',
    errors: Array<{ field: string; message: string }>
  ): Response {
    return this.error(res, message, 422, errors);
  }

  /**
   * Send a too many requests response (429)
   */
  static tooManyRequests(
    res: Response,
    message: string = 'Too many requests, please try again later'
  ): Response {
    return this.error(res, message, 429);
  }

  /**
   * Send a service unavailable response (503)
   */
  static serviceUnavailable(
    res: Response,
    message: string = 'Service temporarily unavailable'
  ): Response {
    return this.error(res, message, 503);
  }
}

/**
 * Async handler wrapper to catch errors
 * Use this to wrap async route handlers
 */
export const asyncHandler = (
  fn: (req: any, res: Response, next: any) => Promise<any>
) => {
  return (req: any, res: Response, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Wrapper for controller methods to handle errors consistently
 */
export const controllerWrapper = (
  controller: (req: any, res: Response) => Promise<any>
) => {
  return async (req: any, res: Response, next: any) => {
    try {
      await controller(req, res);
    } catch (error: any) {
      console.error(`Controller Error: ${error.message}`);
      
      // Handle known error types
      if (error.name === 'ValidationError') {
        return ApiResponse.validationError(
          res,
          error.message,
          error.errors?.map((e: any) => ({
            field: e.path,
            message: e.message
          }))
        );
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
  };
};

export default ApiResponse;

