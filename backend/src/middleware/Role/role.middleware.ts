import { Request,Response, NextFunction } from 'express';


/**
 * Role-based access control middleware.
 * Must be used AFTER `authMiddleware` (requires `req.user` to exist).
 *
 * Usage: `router.get('/admin-only', authMiddleware, roleMiddleware('admin'), handler)`
 */
export const roleMiddleware = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required',
        error: { code: 'UNAUTHORIZED' },
      });
      return;
    }

    if (!req.user || !allowedRoles.includes(req.user.role || '')) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: Insufficient permissions',
        error: { code: 'FORBIDDEN' },
      });
      return;
    }

    next();
  };
};
