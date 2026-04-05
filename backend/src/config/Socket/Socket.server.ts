import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { env } from '../../config/env/env';
import { socketAuthMiddleware } from '../../sockets/Auth/auth.socket';
import { registerChatSocket } from '../../sockets/Chat/chat.socket';
import { setIO } from './socketio.instance';

export const createSocketServer = (httpServer: ReturnType<typeof createServer>): SocketIOServer => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.ALLOWED_ORIGINS
        ? env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
        : '*',
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