
import  express  from 'express';
import { connectDB } from './config/DB/connection';

const bootstrap = async (app: express.Application): Promise<void> => {
app.use(express.json());
await connectDB();
}
export default bootstrap;