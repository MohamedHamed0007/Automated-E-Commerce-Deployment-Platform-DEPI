import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { createForbiddenError, createUnauthorizedError } from '../../utils/ApiErrors/ApiErrors';
import { asyncHandler } from '../../utils/AsyncHandler/asyncHandler.utils';
import { verifyToken } from '../../utils/JWT/jwt.util';

// Extend Express Request to support req.user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email?: string;
        role?: 'user' | 'admin' | 'customer' | 'driver' | 'guest';
      };
    }
  }
}

// ----------------------
//     RATE LIMITER
// ----------------------
export const authlimit = rateLimit({
  windowMs: 90 * 1000, // 1.5 min
  max: 5,
  message: 'too many requests from this IP, try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

const getGuestIdFromRequest = (req: Request): string | undefined => {
  const guestId = String(req.headers['x-guest-id'] ?? req.query.guestId ?? '').trim();
  if (guestId && Types.ObjectId.isValid(guestId)) {
    return guestId;
  }
  return undefined;
};

// ----------------------
//     AUTH MIDDLEWARE
// ----------------------
export const authentication = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split('Bearer ')[1]
      : undefined;

    // fallback to cookie
    if (!token) {
      token = req.cookies?.accessToken;
    }

    if (!token) {
      throw createUnauthorizedError('no token provided');
    }
   
    const decoded = verifyToken(token); // type depends on verifyToken return type

    req.user = decoded;

    next();
  }
);

export const guestOrAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split('Bearer ')[1]
      : undefined;

    // fallback to cookie
    if (!token) {
      token = req.cookies?.accessToken;
    }

    if (token) {
      const decoded = verifyToken(token);
      req.user = decoded;
      return next();
    }

    const guestId = getGuestIdFromRequest(req);
    if (!guestId) {
      throw createUnauthorizedError('no token or guestId provided');
    }

    req.user = { userId: guestId, role: 'guest' };
    next();
  }
);

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

export const authorization = (...roles: string[]) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw createForbiddenError('user info in not found');
    }

    if (!req.user?.role || !roles.includes(req.user.role)) {
      throw createForbiddenError(` only ${roles.join(', ')}  can access this api  `);
    }

    next();
  });
};
