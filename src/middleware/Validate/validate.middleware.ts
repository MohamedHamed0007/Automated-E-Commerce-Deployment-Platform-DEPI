<<<<<<< HEAD
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
=======
// src/middlewares/validationRequest.ts
import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { createValidationError } from '../../utils/ApiErrors/ApiErrors';

// Extend Express Request to include: req.validated
declare module 'express-serve-static-core' {
  interface Request {
    validated?: any;
  }
}

export const ValidationRequest = (schema: Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { value, error } = schema.validate(
        {
          body: req.body,
          params: req.params,
          query: req.query,
          file: (req as any).file,
          files: (req as any).files
        },
        {
          abortEarly: false,
          stripUnknown: true
        }
      );

      if (error) {
        const errorDetail = error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message
        }));

        const validationError = createValidationError('validation failed');
        (validationError as any).details = errorDetail;
        throw validationError;
      }

      // Attach validated data
      req.validated = value;

      if (value.body) req.body = value.body;
      if (value.params) req.params = value.params;
      if (value.query) req.query = value.query;

      next();
    } catch (err) {
>>>>>>> f8a0c5d2581a370d18610aa676556799fc4a8a59
      next(err);
    }
  };
};
<<<<<<< HEAD

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
=======
>>>>>>> f8a0c5d2581a370d18610aa676556799fc4a8a59
