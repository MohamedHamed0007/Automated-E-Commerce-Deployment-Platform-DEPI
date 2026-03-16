import express, { Application, Request, Response } from 'express';
import bootstrap from './app';
import { env } from './config/env/env';

const startServer = async () => {
  const app: Application = express();
  const PORT = Number(env.PORT) || 3000;

  await bootstrap(app);

  app.get('/', (req: Request, res: Response) => {
    res.send('Server is running 🚀');
  });
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${env.NODE_ENV} mode`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
