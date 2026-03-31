import express from 'express';
import cors from 'cors';
import { connectDB } from './config/DB/connection';
import { env } from './config/env/env';
import './config/DB/Models';
import cookieParser from 'cookie-parser';

import { errorHandler } from './middleware/Error/error.middleware';
import routerHandler from './utils/RouterHandler/routerHandler';

const bootstrap = async (app: express.Application): Promise<void> => {
  const allowedOrigins = env.ALLOWED_ORIGINS
    ? env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
    : [env.FRONTEND_URL || 'http://localhost:3001'];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error(`Origin ${origin} is not allowed by CORS`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
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
