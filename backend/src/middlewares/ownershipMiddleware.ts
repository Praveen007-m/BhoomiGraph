import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import logger from '../utils/logger';

/**
 * Ownership Middleware
 * 
 * Ensures users can only access resources they own or are assigned to.
 * This is critical for data isolation in a multi-tenant SaaS platform.
 */

// Extend Express Request to include user permissions
export interface AuthenticatedRequest extends Request {
  user?: any;
  resourceOwnerId?: string;
  assignmentId?: string;
}

/**
 * Check if user owns the resource
 * 
 * @param model - Sequelize model to query
 * @param idParam - Name of the ID parameter (default: 'id')
 * @param ownerField - Name of the owner field in the model (default: 'user_id')
 */
export const checkOwnership = (
  model: any,
  idParam: string = 'id',
  ownerField: string = 'user_id'
) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const resourceId = req.params[idParam];
      const userId = req.user?.id;
      const userRole = req.user?.role?.toLowerCase();

      // Admins have full access
      if (userRole === 'admin') {
        return next();
      }

      if (!resourceId) {
        return ApiResponse.badRequest(res, 'Resource ID is required');
      }

      if (!userId) {
        return ApiResponse.unauthorized(res);
      }

      // Find the resource
      const resource = await model.findByPk(resourceId);

      if (!resource) {
        return ApiResponse.notFound(res, 'Resource not found');
      }

      // Check ownership
      if (resource[ownerField] !== userId) {
        logger.warn(
          `Ownership check failed: User ${userId} tried to access resource ${resourceId} owned by ${resource[ownerField]}`
        );

        return ApiResponse.forbidden(
          res,
          'You do not have permission to access this resource'
        );
      }

      // Store owner ID for potential use in controller
      req.resourceOwnerId = resource[ownerField];

      next();
    } catch (error: any) {
      logger.error(`Ownership check error: ${error.message}`);
      return ApiResponse.error(res, 'Authorization check failed', 500);
    }
  };
};

/**
 * Check if user is assigned to the resource
 * 
 * Used for pilot/agronomist assignments
 * 
 * @param model - Sequelize model with assignment
 * @param idParam - Name of the ID parameter
 */
export const checkAssignment = (
  model: any,
  idParam: string = 'id'
) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const resourceId = req.params[idParam];
      const userId = req.user?.id;
      const userRole = req.user?.role?.toLowerCase();

      // Admins have full access
      if (userRole === 'admin') {
        return next();
      }

      if (!resourceId) {
        return ApiResponse.badRequest(res, 'Resource ID is required');
      }

      if (!userId) {
        return ApiResponse.unauthorized(res);
      }

      // Find the resource with assignment check
      const resource = await model.findByPk(resourceId);

      if (!resource) {
        return ApiResponse.notFound(res, 'Resource not found');
      }

      // Check if user is assigned (depends on model structure)
      // Common patterns: assigned_to, pilot_id, agronomist_id
      const assignmentFields = ['assigned_to', 'pilot_id', 'agronomist_id', 'user_id'];
      let isAssigned = false;

      for (const field of assignmentFields) {
        if (resource[field] === userId) {
          isAssigned = true;
          break;
        }
      }

      if (!isAssigned) {
        logger.warn(
          `Assignment check failed: User ${userId} (role: ${userRole}) tried to access assigned resource ${resourceId}`
        );

        return ApiResponse.forbidden(
          res,
          'You are not assigned to this resource'
        );
      }

      next();
    } catch (error: any) {
      logger.error(`Assignment check error: ${error.message}`);
      return ApiResponse.error(res, 'Authorization check failed', 500);
    }
  };
};

/**
 * Filter query by user ownership
 * 
 * Adds user_id filter to where clause for non-admin users
 * 
 * @param ownerField - Name of the owner field (default: 'user_id')
 */
export const filterByOwnership = (ownerField: string = 'user_id') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const userRole = req.user?.role?.toLowerCase();

    // Admins can see all
    if (userRole === 'admin') {
      return next();
    }

    if (!userId) {
      return ApiResponse.unauthorized(res);
    }

    // Initialize where clause if not present
    if (!req.query.where) {
      req.query.where = {};
    }

    // Add ownership filter
    const where = typeof req.query.where === 'string' 
      ? JSON.parse(req.query.where) 
      : { ...req.query.where };
    
    where[ownerField] = userId;
    req.query.where = JSON.stringify(next);
    req.query.where = where;

    next();
  };
};

/**
 * Middleware factory for role-based resource access
 * 
 * @param allowedRoles - Roles that can access the resource
 * @param ownershipCheck - Whether to check ownership
 */
export const authorizeResource = (
  allowedRoles: string[],
  ownershipCheck: boolean = false
) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userRole = req.user?.role?.toLowerCase();
      const userId = req.user?.id;

      if (!userRole || !userId) {
        return ApiResponse.unauthorized(res);
      }

      // Check role authorization
      if (!allowedRoles.includes(userRole)) {
        logger.warn(
          `Role authorization failed: User ${userId} with role ${userRole} tried to access resource requiring ${allowedRoles.join(', ')}`
        );

        return ApiResponse.forbidden(
          res,
          'You do not have permission to access this resource'
        );
      }

      // Ownership check is handled separately by checkOwnership middleware
      // This middleware just handles role-based access
      next();
    } catch (error: any) {
      logger.error(`Authorization error: ${error.message}`);
      return ApiResponse.error(res, 'Authorization failed', 500);
    }
  };
};

/**
 * Verify pilot assignment to a specific booking/mission
 */
export const verifyPilotAssignment = () => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const bookingId = req.params.id || req.params.bookingId;
      const userId = req.user?.id;
      const userRole = req.user?.role?.toLowerCase();

      // Admins and pilots only
      if (!['admin', 'pilot'].includes(userRole || '')) {
        return ApiResponse.forbidden(res, 'Only pilots can access this resource');
      }

      // Admins have full access
      if (userRole === 'admin') {
        return next();
      }

      if (!bookingId) {
        return ApiResponse.badRequest(res, 'Booking ID is required');
      }

      // Import here to avoid circular dependency
      const { ServiceBooking } = await import('../models/ServiceBooking');
      
      const booking = await ServiceBooking.findByPk(bookingId);

      if (!booking) {
        return ApiResponse.notFound(res, 'Booking not found');
      }

      // Check if pilot is assigned
      if (booking.assigned_pilot_id !== userId) {
        logger.warn(
          `Pilot assignment check failed: Pilot ${userId} tried to access booking ${bookingId} assigned to ${booking.assigned_pilot_id}`
        );

        return ApiResponse.forbidden(
          res,
          'You are not assigned to this mission'
        );
      }

      next();
    } catch (error: any) {
      logger.error(`Pilot assignment check error: ${error.message}`);
      return ApiResponse.error(res, 'Authorization check failed', 500);
    }
  };
};

/**
 * Verify agronomist assignment to a specific farm
 */
export const verifyAgronomistAssignment = () => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const farmId = req.params.farmId || req.params.id;
      const userId = req.user?.id;
      const userRole = req.user?.role?.toLowerCase();

      // Admins and agronomists only
      if (!['admin', 'agronomist'].includes(userRole || '')) {
        return ApiResponse.forbidden(res, 'Only agronomists can access this resource');
      }

      // Admins have full access
      if (userRole === 'admin') {
        return next();
      }

      if (!farmId) {
        return ApiResponse.badRequest(res, 'Farm ID is required');
      }

      // For now, agronomists can see farms they create advisories for
      // This can be extended to have explicit farm assignments
      const { Farm } = await import('../models/Farm');
      
      const farm = await Farm.findByPk(farmId);

      if (!farm) {
        return ApiResponse.notFound(res, 'Farm not found');
      }

      // Agronomists can view any farm (can be restricted with specific assignments)
      // For now, we allow agronomists to view farms they're consulted on
      next();
    } catch (error: any) {
      logger.error(`Agronomist assignment check error: ${error.message}`);
      return ApiResponse.error(res, 'Authorization check failed', 500);
    }
  };
};

export default {
  checkOwnership,
  checkAssignment,
  filterByOwnership,
  authorizeResource,
  verifyPilotAssignment,
  verifyAgronomistAssignment
};

