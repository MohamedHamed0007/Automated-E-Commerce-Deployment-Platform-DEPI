import { Socket } from 'socket.io';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../../config/env/env';
import  {User} from '../../config/DB/Models/User/user.models';

export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void
): Promise<void> => {
  try {
    const raw: string | undefined =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization;

    if (!raw) {
      return next(new Error('UNAUTHORIZED: No token provided'));
    }

    const token = raw.startsWith('Bearer ') ? raw.slice(7) : raw;

    // Verify JWT
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload & {
      id: string;
      role: string;
    };

    const user = await User.findById(decoded.id).select(
      '_id email role isBlocked isVerified'
    );

    if (!user) {
      return next(new Error('UNAUTHORIZED: User not found'));
    }

    if (user.isBlocked) {
      return next(new Error('FORBIDDEN: Your account has been blocked'));
    }

    if (!user.isVerified) {
      return next(new Error('FORBIDDEN: Please verify your email first'));
    }

    socket.data.user = {
      _id: String(user._id),
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new Error('UNAUTHORIZED: Token expired'));
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new Error('UNAUTHORIZED: Invalid token'));
    }
    next(new Error('INTERNAL: Auth middleware error'));
  }
};
