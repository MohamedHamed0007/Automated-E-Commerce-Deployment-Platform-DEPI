import express from 'express';
import { connectDB } from './config/DB/connection';
import routerHandler from './utils/RouterHandler/routerHandler';

const bootstrap = async (app: express.Application): Promise<void> => {
  app.use(express.json());
  await routerHandler(app);
  await connectDB();
};
export default bootstrap;
