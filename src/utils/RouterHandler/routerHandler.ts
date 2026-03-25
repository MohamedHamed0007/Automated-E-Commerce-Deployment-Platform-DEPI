import express, { Application, Request, Response } from 'express';
import { env } from '../../config/env/env';
import chatRoutes from '../../routes/Chat/chat.routes';
import adminRoutes from '../../routes/Admin/admin.routes';
import authRouter from '../../routes/Auth/auth.routes';
import paymentRoutes from '../../routes/Payment/payment.routes';
import stripeRoutes from '../../routes/Payment/stripe.routes';

const routerHandler = async (app: Application): Promise<void> => {
  app.use(express.json());

  // Authentication routes
  app.use(`${env.API_PREFIX}/auth`, authRouter);
  app.use(`${env.API_PREFIX}/chatApi`, chatRoutes);
  app.use(`${env.API_PREFIX}/admin`, adminRoutes);
  app.use(`${env.API_PREFIX}/payments`, paymentRoutes);
  app.use(`${env.API_PREFIX}/stripe`, stripeRoutes);

  // Catch-all for undefined routes
  app.use('*', (req: Request, res: Response) => {
    res.status(404).json({ message: 'This route is not found' });
  });
};

export default routerHandler;
