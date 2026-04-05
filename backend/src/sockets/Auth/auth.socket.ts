import { Socket } from 'socket.io';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
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
    const raw: string | undefined =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization;

    const guestId = typeof socket.handshake.auth?.guestId === 'string'
      ? String(socket.handshake.auth.guestId).trim()
      : undefined;

    if (raw) {
      const token = raw.startsWith('Bearer ') ? raw.slice(7) : raw;

      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload & {
        userId: string;
        role: string;
      };

      const user = await User.findById(decoded.userId).select(
        '_id email role isBlocked isVerified'
      );

      if (!user) {
        return next(new Error('UNAUTHORIZED: User not found'));
      }

      if (user.isBlocked) {
        return next(new Error('FORBIDDEN: Your account has been blocked'));
      }

      socket.data.user = {
        _id: String(user._id),
        email: user.email,
        role: user.role,
      };
      return next();
    }

    if (!guestId || !Types.ObjectId.isValid(guestId)) {
      return next(new Error('UNAUTHORIZED: No token or valid guestId provided'));
    }

    socket.data.user = {
      _id: guestId,
      email: 'guest@shippshere.local',
      role: 'guest',
    };

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