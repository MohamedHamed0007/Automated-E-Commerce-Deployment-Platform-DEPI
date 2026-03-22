

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/DB/connection';
import { env } from './config/env/env';
import './config/DB/Models';

import { errorHandler } from './middleware/Error/error.middleware';
import routerHandler from './utils/RouterHandler/routerHandler';

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

  await routerHandler(app);
 
  app.use(errorHandler);
};

export default bootstrap;
