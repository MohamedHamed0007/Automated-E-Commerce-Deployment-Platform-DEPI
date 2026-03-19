import jwt, { SignOptions, JwtPayload as JwtBasePayload } from 'jsonwebtoken';
import { env } from '../../config/env/env';
import { createUnauthorizedError } from '../ApiErrors/ApiErrors';

interface JwtPayload {
  userId: string;
  email: string;
  role: 'admin' | 'customer' | 'driver';
}

export const generateAccessToken = (payload: JwtPayload): string => {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in env');
  }

  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRE as any
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in env');
  }

  const secret: jwt.Secret = env.JWT_SECRET;
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRE as SignOptions['expiresIn']
  };

  return jwt.sign(payload, secret, options);
};
export const generateResetToken = (payload: { userId: string }): string => {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in env');
  }

  const secret: jwt.Secret = env.JWT_SECRET;
  const options: SignOptions = {
    expiresIn: env.JWT_RESET_PASSWORD_EXPIRE as SignOptions['expiresIn']
  };

  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): JwtBasePayload | string => {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in env');
  }

  try {
    return jwt.verify(token, env.JWT_SECRET) as JwtBasePayload | string;
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

export const decodeToken = (token: string): JwtBasePayload | string | null => {
  return jwt.decode(token);
};
