import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import mongoose from 'mongoose';

/**
 * Validates `req.body` against a Zod schema.
 * Returns 400 with structured error details on failure.
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: { code: 'VALIDATION_ERROR', details },
        });
        return;
      }
      next(err);
    }
  };
};

/**
 * Validates that a URL param (e.g. `:id`, `:chatId`) is a valid MongoDB ObjectId.
 * Returns 400 with INVALID_ID error code on failure.
 */
export const validateObjectId = (paramName = 'id') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
      res.status(400).json({
        success: false,
        message: `${paramName} must be a valid ObjectId`,
        error: { code: 'INVALID_ID' },
      });
      return;
    }
    next();
  };
};
