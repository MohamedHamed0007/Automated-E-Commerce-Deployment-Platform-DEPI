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
      next(err);
    }
  };
};
