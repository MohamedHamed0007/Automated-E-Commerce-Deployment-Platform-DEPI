
import express, { Application, Request, Response } from "express";
import {env} from "./config/env/env"
import { createServer } from 'http';
import { createSocketServer } from './config/Socket/Socket.server';
import bootstrap from "./app";

const startServer = async () => {
  const app: Application = express();
  const PORT = Number(env.PORT) || 3000;

  await bootstrap(app);

  app.get('/', (req: Request, res: Response) => {
    res.send('Server is running 🚀');
  });

  app.get('/api/v1/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
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

