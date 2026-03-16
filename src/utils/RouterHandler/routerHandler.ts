import express, { Application, Request, Response } from 'express';
import authRouter from '../../routes/Auth/auth.routes';
import { env } from '../../config/env/env';

const routerHandler = async (app: Application): Promise<void> => {
  app.use(express.json());

  // Authentication routes
  app.use(`${env.API_PREFIX}/auth`, authRouter);

  // Catch-all for undefined routes
  app.use('*', (req: Request, res: Response) => {
    res.status(404).json({ message: 'This route is not found' });
  });
};

export default routerHandler;
