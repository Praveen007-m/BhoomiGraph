"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (roles) => {
    return (req, res, next) => {
        var _a;
        // Ensure user exists (set by authenticate middleware)
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        // Normalize roles for safe comparison
        const userRole = (_a = req.user.role) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        const authorizedRoles = roles.map(role => role.toLowerCase());
        if (!userRole || !authorizedRoles.includes(userRole)) {
            return res.status(403).json({
                message: "Forbidden: Insufficient permissions",
            });
        }
        next();
    };
};
exports.authorize = authorize;
