import { Request, Response, NextFunction } from 'express';

/**
 * Global error-handling middleware.
 * Catches all errors thrown (or passed via `next(err)`) from asyncHandler.
 * Returns a standardised JSON error response.
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // If the error carries a numeric code string (e.g. '404', '403'), use it
  const statusCode: number =
    typeof err.code === 'string' && /^\d{3}$/.test(err.code)
      ? parseInt(err.code, 10)
      : err.statusCode || 500;

  const message: string = err.message || 'Internal server error';

  console.error(`[ERROR] ${statusCode} – ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
