import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../../config/env/env';
import { createUnauthorizedError } from '../ApiErrors/ApiErrors';

// Define what type your token payload will contain
export interface TokenPayload extends JwtPayload {
  id: string; // example
  email?: string; // example
  role?: string; // example
}

// Generate Access Token
export const generateAccessToken = (payload: TokenPayload): string => {
  const options = { expiresIn: env.JWT.ACCESS_EXPIRE } as any;
  return jwt.sign(payload, env.JWT.SECRET as string, options);
};

// Generate Refresh Token
export const generateRefreshToken = (payload: TokenPayload): string => {
  const options = { expiresIn: env.JWT.REFRESH_EXPIRE } as any;
  return jwt.sign(payload, env.JWT.SECRET as string, options);
};

// Generate Password Reset Token
export const generateResetToken = (payload: TokenPayload): string => {
  const options = { expiresIn: env.JWT.RESET_PASSWORD_EXPIRE } as any;
  return jwt.sign(payload, env.JWT.SECRET as string, options);
};

// Verify Token
export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, env.JWT.SECRET as string) as TokenPayload;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw createUnauthorizedError('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw createUnauthorizedError('Invalid token');
    }
    throw createUnauthorizedError('Token verification failed');
  }
};

// Decode Token (not verified)
export const decodeToken = (token: string): TokenPayload | null => {
  return jwt.decode(token) as TokenPayload | null;
};
