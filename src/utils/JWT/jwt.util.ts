import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../../config/env/env';
import { createUnauthorizedError } from '../ApiErrors/ApiErrors';

if (!env.JWT_SECRET && !env.JWT?.SECRET) {
  throw new Error('JWT secret is not configured');
}

const JWT_SECRET = env.JWT?.SECRET || env.JWT_SECRET;

// Define what type your token payload will contain
export interface TokenPayload extends JwtPayload {
  id: string;
  email?: string;
  role?: string;
}

// Generate Access Token
export const generateAccessToken = (payload: TokenPayload): string => {
  const options = { expiresIn: env.JWT?.ACCESS_EXPIRE || env.JWT_ACCESS_EXPIRE } as any;
  return jwt.sign(payload, JWT_SECRET as string, options);
};

// Generate Refresh Token
export const generateRefreshToken = (payload: TokenPayload): string => {
  const options = { expiresIn: env.JWT?.REFRESH_EXPIRE || env.JWT_REFRESH_EXPIRE } as any;
  return jwt.sign(payload, JWT_SECRET as string, options);
};

// Generate Password Reset Token
export const generateResetToken = (payload: TokenPayload): string => {
  const options = { expiresIn: env.JWT?.RESET_PASSWORD_EXPIRE || env.JWT_RESET_PASSWORD_EXPIRE } as any;
  return jwt.sign(payload, JWT_SECRET as string, options);
};

// Verify Token
export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, JWT_SECRET as string) as TokenPayload;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        throw createUnauthorizedError('Token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw createUnauthorizedError('Invalid token');
      }
    }
    throw createUnauthorizedError('Token verification failed');
  }
};

// Decode Token (not verified)
export const decodeToken = (token: string): TokenPayload | null => {
  return jwt.decode(token) as TokenPayload | null;
};
