

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/DB/connection';
import { env } from './config/env/env';
import './config/DB/Models';
import chatRoutes from './routes/chat/chat.routes';
import adminRoutes from './routes/admin/admin.routes';
import { errorHandler } from './middleware/Error/error.middleware';
import authRouter from './routes/auth/auth.routes';

const bootstrap = async (app: express.Application): Promise<void> => {
  app.use(express.json());
  app.use(
    cors({
      origin: env.ALLOWED_ORIGINS
        ? env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
        : '*',
      credentials: true,
    })
  );


  await connectDB();
  app.use('/chatApi', chatRoutes);
  app.use('/admin', adminRoutes);
  app.use('/auth', authRouter);
  app.use(errorHandler);
};

export default bootstrap;
