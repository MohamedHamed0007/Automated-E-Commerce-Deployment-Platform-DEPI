import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Shippo } from 'shippo';

const envDir = path.resolve(process.cwd(), 'env');
const envFileBase = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';
let envPath = path.join(envDir, envFileBase);

if (!fs.existsSync(envPath)) {
  console.warn(`WARNING: ${envPath} not found. Falling back to .env.dev.`);
  envPath = path.join(envDir, '.env.dev');
}

const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error(`Failed to load env from ${envPath}:`, result.error);
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  EMAIL_HOST: process.env.EMAIL_HOST as string,
  EMAIL_PORT:process.env.EMAIL_PORT as string,
  EMAIL_SECURE:process.env.EMAIL_SECURE as string,
  EMAIL_USER:process.env.EMAIL_USER as string,
  EMAIL_PASSWORD:process.env.EMAIL_PASSWORD as string,
  EMAIL_FROM:process.env.EMAIL_FROM as string,
  JWT_ACCESS_EXPIRE:process.env.JWT_ACCESS_EXPIRE as string,
  JWT_REFRESH_EXPIRE:process.env.JWT_REFRESH_EXPIRE as string,
  JWT_RESET_PASSWORD_EXPIRE:process.env.JWT_RESET_PASSWORD_EXPIRE as string,
  FRONTEND_URL:process.env.FRONTEND_URL as string,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS as string,
  API_PREFIX: process.env.API_PREFIX as string,
  SHIPPO_API_KEY: process.env.SHIPPO_API_KEY as string,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
  JWT: {
    SECRET: process.env.JWT_SECRET as string,
    ACCESS_EXPIRE: process.env.JWT_ACCESS_EXPIRE as string,
    REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE as string,
    RESET_PASSWORD_EXPIRE: process.env.JWT_RESET_PASSWORD_EXPIRE as string
  }
};

if (!env.JWT_SECRET) {
  console.warn("WARNING: JWT_SECRET is not defined in the environment.");
}

if (!env.JWT?.SECRET) {
  console.warn("WARNING: env.JWT.SECRET is not defined in the environment.");
}

if (!env.MONGO_URI) {
  console.warn("WARNING: MONGO_URI is not defined in the environment.");
}

export const shippo = new Shippo({ apiKeyHeader: process.env.SHIPPO_API_KEY! });
