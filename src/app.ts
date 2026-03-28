import express from 'express';
import cors from 'cors';
import { connectDB } from './config/DB/connection';
import { env } from './config/env/env';
import './config/DB/Models';
import cookieParser from 'cookie-parser';

import { errorHandler } from './middleware/Error/error.middleware';
import routerHandler from './utils/RouterHandler/routerHandler';

const bootstrap = async (app: express.Application): Promise<void> => {
  app.use(
    cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') ?? 'http://localhost:3000',
      credentials: true
    })
  );

  app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
  app.use(express.json());
  app.use(cookieParser());

  await connectDB();

  await routerHandler(app);

  app.use(errorHandler);
};

export default bootstrap;
