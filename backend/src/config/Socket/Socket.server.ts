import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { env } from '../../config/env/env';
import { socketAuthMiddleware } from '../../sockets/Auth/auth.socket';
import { registerChatSocket } from '../../sockets/Chat/chat.socket';
import { setIO } from './socketio.instance';

const parseOrigins = (originsStr: string | undefined): string[] => {
  if (!originsStr) return [];
  return originsStr.split(',').map(o => o.trim());
};

const isOriginAllowed = (origin: string): boolean => {
  const allowedOrigins = parseOrigins(env.ALLOWED_ORIGINS);
  const previewPatterns = parseOrigins(env.VERCEL_PREVIEW_PATTERNS);
  
  const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;

  if (allowedOrigins.includes(normalizedOrigin)) {
    return true;
  }

  if (previewPatterns.length > 0) {
    const isPreview = previewPatterns.some((pattern) => {
      const regexPattern = '^' + pattern.replace(/\*/g, '[^.]+') + '$';
      const regex = new RegExp(regexPattern, 'i');
      return regex.test(normalizedOrigin);
    });

    if (isPreview) {
      return true;
    }
  }

  return false;
};

export const createSocketServer = (httpServer: ReturnType<typeof createServer>): SocketIOServer => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) {
          return callback(null, true);
        }

        if (isOriginAllowed(origin)) {
          return callback(null, true);
        }

        return callback(new Error(`Origin ${origin} is not allowed by CORS`));
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.use(socketAuthMiddleware);
  registerChatSocket(io);
  setIO(io);

  return io;
};
