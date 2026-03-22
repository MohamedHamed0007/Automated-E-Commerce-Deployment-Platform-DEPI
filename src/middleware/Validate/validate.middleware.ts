import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import mongoose from "mongoose";

// Validates request body against a Joi schema
export const validateBody = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message,
      }));
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", details },
      });
    }
    next();
  };
};

// Validates that :id param is a valid MongoDB ObjectId
// Use this on any route that has /:id or /:shipmentId
export const validateObjectId = (paramName = "id") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_ID",
          message: `${paramName} is not a valid ID`,
        },
      });
    }
    next();
  };
};

export const validateQuery = (schema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message,
      }));
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", details },
      });
    }
    req.query = value; // replace query with validated + defaulted values
    next();
  };
};
