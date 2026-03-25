import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { createUnauthorizedError } from '../../utils/ApiErrors/ApiErrors';
import { asyncHandler } from '../../utils/AsyncHandler/asyncHandler.utils';
import { verifyToken } from '../../utils/JWT/jwt.util';

// Extend Express Request to support req.user
declare global {
  namespace Express {
    interface Request {
      user?: any;
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
    console.log('TOKEN RECEIVED:', req.headers.authorization);
    console.log('COOKIE TOKEN:', req.cookies?.accessToken);
    const decoded = verifyToken(token); // type depends on verifyToken return type

    req.user = decoded;

    next();
  }
);

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};
