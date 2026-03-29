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
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
  })
);

  app.use('/api/v1/stripe/webhook', express.raw({ type: '*/*' }));
  app.use(express.json());
  app.use(cookieParser());

  await connectDB();

  await routerHandler(app);

  app.use(errorHandler);
};

export default bootstrap;
