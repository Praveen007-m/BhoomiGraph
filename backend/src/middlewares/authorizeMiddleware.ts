import { Request, Response, NextFunction } from "express";

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Ensure user exists (set by authenticate middleware)
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Normalize roles for safe comparison
    const userRole = req.user.role?.toLowerCase();
    const authorizedRoles = roles.map(role => role.toLowerCase());

    if (!userRole || !authorizedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Forbidden: Insufficient permissions",
      });
    }

    next();
  };
};