
import express, { Application, Request, Response } from "express";
import { createServer } from 'http';
import bootstrap from './app';
import { env } from './config/env/env';
import { createSocketServer } from './config/Socket/Socket.server';

const startServer = async () => {
  const app: Application = express();
  const PORT = Number(env.PORT) || 5000;

  await bootstrap(app);

  app.get('/', (req: Request, res: Response) => {
    res.send('Server is running 🚀');
  });

  const httpServer = createServer(app);

  const io = createSocketServer(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Server + WebSocket running on port ${PORT} in ${env.NODE_ENV} mode`);
  });
};

startServer().catch((err) => {

  console.error('Failed to start server:', err);
});

