import jwt, { SignOptions, JwtPayload as JwtBasePayload } from 'jsonwebtoken';
import { env } from '../../config/env/env';
import { createUnauthorizedError } from '../ApiErrors/ApiErrors';

interface JwtPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}

export const generateAccessToken = (payload: JwtPayload): string => {
  if (!env.JWT.SECRET) {
    throw new Error('JWT_SECRET is not defined in env');
  }

  const options: SignOptions = {
    expiresIn: env.JWT.ACCESS_EXPIRE as any
  };

  return jwt.sign(payload, env.JWT.SECRET, options);
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  if (!env.JWT.SECRET) {
    throw new Error('JWT_SECRET is not defined in env');
  }

  const secret: jwt.Secret = env.JWT.SECRET;
  const options: SignOptions = {
    expiresIn: env.JWT.REFRESH_EXPIRE as SignOptions['expiresIn']
  };

  return jwt.sign(payload, secret, options);
};
export const generateResetToken = (payload: { userId: string }): string => {
  if (!env.JWT.SECRET) {
    throw new Error('JWT_SECRET is not defined in env');
  }

  const secret: jwt.Secret = env.JWT.SECRET;
  const options: SignOptions = {
    expiresIn: env.JWT.RESET_PASSWORD_EXPIRE as SignOptions['expiresIn']
  };

  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): JwtBasePayload | string => {
  if (!env.JWT.SECRET) {
    throw new Error('JWT_SECRET is not defined in env');
  }

  try {
    return jwt.verify(token, env.JWT.SECRET) as JwtBasePayload | string;
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
