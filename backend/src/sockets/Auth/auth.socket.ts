import { Socket } from 'socket.io';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../../config/env/env';
import User from '../../config/DB/Models/User/user.models';

/**
 * Socket.IO Authentication Middleware
 * - Validates JWT token from client handshake
 * - Attaches authenticated user data to socket
 */
export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void
): Promise<void> => {
  try {
    /**
     * Extract token from:
     * - handshake.auth.token (preferred)
     * - Authorization header (fallback)
     */
    const raw: string | undefined =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization;

    // If no token provided → reject connection
    if (!raw) {
      return next(new Error('UNAUTHORIZED: No token provided'));
    }

    /**
     * Remove "Bearer " prefix if exists
     */
    const token = raw.startsWith('Bearer ') ? raw.slice(7) : raw;

    /**
     * Verify JWT token using secret key
     * Expected payload includes: id, role
     */
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload & {
      id: string;
      role: string;
    };

    /**
     * Fetch user from database
     * Select only necessary fields for performance & security
     */
    const user = await User.findById(decoded.id).select(
      '_id email role isBlocked isVerified'
    );

    // If user not found → reject
    if (!user) {
      return next(new Error('UNAUTHORIZED: User not found'));
    }

    // If user is blocked → reject
    if (user.isBlocked) {
      return next(new Error('FORBIDDEN: Your account has been blocked'));
    }

    // If user is not verified → reject
    if (!user.isVerified) {
      return next(new Error('FORBIDDEN: Please verify your email first'));
    }

    /**
     * Attach user data to socket
     * This will be accessible later via socket.data.user
     */
    socket.data.user = {
      _id: String(user._id),
      email: user.email,
      role: user.role,
    };

    // Allow connection
    next();
  } catch (err: unknown) {
    /**
     * Handle token expiration error
     */
    if (err instanceof jwt.TokenExpiredError) {
      return next(new Error('UNAUTHORIZED: Token expired'));
    }

    /**
     * Handle invalid token error
     */
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new Error('UNAUTHORIZED: Invalid token'));
    }

    /**
     * Handle unexpected errors
     */
    next(new Error('INTERNAL: Auth middleware error'));
  }
};