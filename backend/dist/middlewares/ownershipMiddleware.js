"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAgronomistAssignment = exports.verifyPilotAssignment = exports.authorizeResource = exports.filterByOwnership = exports.checkAssignment = exports.checkOwnership = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Check if user owns the resource
 *
 * @param model - Sequelize model to query
 * @param idParam - Name of the ID parameter (default: 'id')
 * @param ownerField - Name of the owner field in the model (default: 'user_id')
 */
const checkOwnership = (model, idParam = 'id', ownerField = 'user_id') => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const resourceId = req.params[idParam];
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const userRole = (_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === null || _c === void 0 ? void 0 : _c.toLowerCase();
            // Admins have full access
            if (userRole === 'admin') {
                return next();
            }
            if (!resourceId) {
                return apiResponse_1.ApiResponse.badRequest(res, 'Resource ID is required');
            }
            if (!userId) {
                return apiResponse_1.ApiResponse.unauthorized(res);
            }
            // Find the resource
            const resource = yield model.findByPk(resourceId);
            if (!resource) {
                return apiResponse_1.ApiResponse.notFound(res, 'Resource not found');
            }
            // Check ownership
            if (resource[ownerField] !== userId) {
                logger_1.default.warn(`Ownership check failed: User ${userId} tried to access resource ${resourceId} owned by ${resource[ownerField]}`);
                return apiResponse_1.ApiResponse.forbidden(res, 'You do not have permission to access this resource');
            }
            // Store owner ID for potential use in controller
            req.resourceOwnerId = resource[ownerField];
            next();
        }
        catch (error) {
            logger_1.default.error(`Ownership check error: ${error.message}`);
            return apiResponse_1.ApiResponse.error(res, 'Authorization check failed', 500);
        }
    });
};
exports.checkOwnership = checkOwnership;
/**
 * Check if user is assigned to the resource
 *
 * Used for pilot/agronomist assignments
 *
 * @param model - Sequelize model with assignment
 * @param idParam - Name of the ID parameter
 */
const checkAssignment = (model, idParam = 'id') => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const resourceId = req.params[idParam];
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const userRole = (_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === null || _c === void 0 ? void 0 : _c.toLowerCase();
            // Admins have full access
            if (userRole === 'admin') {
                return next();
            }
            if (!resourceId) {
                return apiResponse_1.ApiResponse.badRequest(res, 'Resource ID is required');
            }
            if (!userId) {
                return apiResponse_1.ApiResponse.unauthorized(res);
            }
            // Find the resource with assignment check
            const resource = yield model.findByPk(resourceId);
            if (!resource) {
                return apiResponse_1.ApiResponse.notFound(res, 'Resource not found');
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
                logger_1.default.warn(`Assignment check failed: User ${userId} (role: ${userRole}) tried to access assigned resource ${resourceId}`);
                return apiResponse_1.ApiResponse.forbidden(res, 'You are not assigned to this resource');
            }
            next();
        }
        catch (error) {
            logger_1.default.error(`Assignment check error: ${error.message}`);
            return apiResponse_1.ApiResponse.error(res, 'Authorization check failed', 500);
        }
    });
};
exports.checkAssignment = checkAssignment;
/**
 * Filter query by user ownership
 *
 * Adds user_id filter to where clause for non-admin users
 *
 * @param ownerField - Name of the owner field (default: 'user_id')
 */
const filterByOwnership = (ownerField = 'user_id') => {
    return (req, res, next) => {
        var _a, _b, _c;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const userRole = (_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === null || _c === void 0 ? void 0 : _c.toLowerCase();
        // Admins can see all
        if (userRole === 'admin') {
            return next();
        }
        if (!userId) {
            return apiResponse_1.ApiResponse.unauthorized(res);
        }
        // Initialize where clause if not present
        if (!req.query.where) {
            req.query.where = {};
        }
        // Add ownership filter
        const where = typeof req.query.where === 'string'
            ? JSON.parse(req.query.where)
            : Object.assign({}, req.query.where);
        where[ownerField] = userId;
        req.query.where = JSON.stringify(next);
        req.query.where = where;
        next();
    };
};
exports.filterByOwnership = filterByOwnership;
/**
 * Middleware factory for role-based resource access
 *
 * @param allowedRoles - Roles that can access the resource
 * @param ownershipCheck - Whether to check ownership
 */
const authorizeResource = (allowedRoles, ownershipCheck = false) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const userRole = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === null || _b === void 0 ? void 0 : _b.toLowerCase();
            const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
            if (!userRole || !userId) {
                return apiResponse_1.ApiResponse.unauthorized(res);
            }
            // Check role authorization
            if (!allowedRoles.includes(userRole)) {
                logger_1.default.warn(`Role authorization failed: User ${userId} with role ${userRole} tried to access resource requiring ${allowedRoles.join(', ')}`);
                return apiResponse_1.ApiResponse.forbidden(res, 'You do not have permission to access this resource');
            }
            // Ownership check is handled separately by checkOwnership middleware
            // This middleware just handles role-based access
            next();
        }
        catch (error) {
            logger_1.default.error(`Authorization error: ${error.message}`);
            return apiResponse_1.ApiResponse.error(res, 'Authorization failed', 500);
        }
    });
};
exports.authorizeResource = authorizeResource;
/**
 * Verify pilot assignment to a specific booking/mission
 */
const verifyPilotAssignment = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const bookingId = req.params.id || req.params.bookingId;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const userRole = (_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === null || _c === void 0 ? void 0 : _c.toLowerCase();
            // Admins and pilots only
            if (!['admin', 'pilot'].includes(userRole || '')) {
                return apiResponse_1.ApiResponse.forbidden(res, 'Only pilots can access this resource');
            }
            // Admins have full access
            if (userRole === 'admin') {
                return next();
            }
            if (!bookingId) {
                return apiResponse_1.ApiResponse.badRequest(res, 'Booking ID is required');
            }
            // Import here to avoid circular dependency
            const { ServiceBooking } = yield Promise.resolve().then(() => __importStar(require('../models/ServiceBooking')));
            const booking = yield ServiceBooking.findByPk(bookingId);
            if (!booking) {
                return apiResponse_1.ApiResponse.notFound(res, 'Booking not found');
            }
            // Check if pilot is assigned
            if (booking.assigned_pilot_id !== userId) {
                logger_1.default.warn(`Pilot assignment check failed: Pilot ${userId} tried to access booking ${bookingId} assigned to ${booking.assigned_pilot_id}`);
                return apiResponse_1.ApiResponse.forbidden(res, 'You are not assigned to this mission');
            }
            next();
        }
        catch (error) {
            logger_1.default.error(`Pilot assignment check error: ${error.message}`);
            return apiResponse_1.ApiResponse.error(res, 'Authorization check failed', 500);
        }
    });
};
exports.verifyPilotAssignment = verifyPilotAssignment;
/**
 * Verify agronomist assignment to a specific farm
 */
const verifyAgronomistAssignment = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const farmId = req.params.farmId || req.params.id;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const userRole = (_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === null || _c === void 0 ? void 0 : _c.toLowerCase();
            // Admins and agronomists only
            if (!['admin', 'agronomist'].includes(userRole || '')) {
                return apiResponse_1.ApiResponse.forbidden(res, 'Only agronomists can access this resource');
            }
            // Admins have full access
            if (userRole === 'admin') {
                return next();
            }
            if (!farmId) {
                return apiResponse_1.ApiResponse.badRequest(res, 'Farm ID is required');
            }
            // For now, agronomists can see farms they create advisories for
            // This can be extended to have explicit farm assignments
            const { Farm } = yield Promise.resolve().then(() => __importStar(require('../models/Farm')));
            const farm = yield Farm.findByPk(farmId);
            if (!farm) {
                return apiResponse_1.ApiResponse.notFound(res, 'Farm not found');
            }
            // Agronomists can view any farm (can be restricted with specific assignments)
            // For now, we allow agronomists to view farms they're consulted on
            next();
        }
        catch (error) {
            logger_1.default.error(`Agronomist assignment check error: ${error.message}`);
            return apiResponse_1.ApiResponse.error(res, 'Authorization check failed', 500);
        }
    });
};
exports.verifyAgronomistAssignment = verifyAgronomistAssignment;
exports.default = {
    checkOwnership: exports.checkOwnership,
    checkAssignment: exports.checkAssignment,
    filterByOwnership: exports.filterByOwnership,
    authorizeResource: exports.authorizeResource,
    verifyPilotAssignment: exports.verifyPilotAssignment,
    verifyAgronomistAssignment: exports.verifyAgronomistAssignment
};
