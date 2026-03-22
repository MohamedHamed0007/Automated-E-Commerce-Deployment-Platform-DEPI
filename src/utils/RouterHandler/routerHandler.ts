import express, { Application, Request, Response } from 'express';
import authRouter from '../../routes/auth/auth.routes';
import { env } from '../../config/env/env';
import chatRoutes from '../../routes/chat/chat.routes';
import adminRoutes from '../../routes/admin/admin.routes';
const routerHandler = async (app: Application): Promise<void> => {
  app.use(express.json());

  // Authentication routes
  app.use(`${env.API_PREFIX}/auth`, authRouter);
 app.use(`${env.API_PREFIX}/chatApi`, chatRoutes);
  app.use(`${env.API_PREFIX}/admin`, adminRoutes);;
  // Catch-all for undefined routes
  app.use('*', (req: Request, res: Response) => {
    res.status(404).json({ message: 'This route is not found' });
  });

};

export default routerHandler;
