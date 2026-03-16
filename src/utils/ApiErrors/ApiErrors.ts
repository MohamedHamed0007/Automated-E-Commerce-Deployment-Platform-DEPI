import { HTTP_STATUS } from '../Response/api.response.utils.js';

export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public success: boolean;

  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true,
    stack: string = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Helper functions
export const createBadRequestError = (message: string = 'bad request'): ApiError => {
  return new ApiError(HTTP_STATUS.BAD_REQUEST, message);
};

export const createUnauthorizedError = (
  message: string = 'Unauthorized - Please login'
): ApiError => {
  return new ApiError(HTTP_STATUS.UNAUTHORIZED, message);
};

export const createForbiddenError = (
  message: string = "Forbidden - You don't have permission"
): ApiError => {
  return new ApiError(HTTP_STATUS.FORBIDDEN, message);
};

export const createNotFoundError = (message: string = 'Resource not found'): ApiError => {
  return new ApiError(HTTP_STATUS.NOT_FOUND, message);
};

export const createConflictError = (message: string = 'Resource already exists'): ApiError => {
  return new ApiError(HTTP_STATUS.CONFLICT, message);
};

export const createValidationError = (message: string = 'Validation error'): ApiError => {
  return new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, message);
};

export const createTooManyRequestsError = (message: string = 'Too many requests'): ApiError => {
  return new ApiError(HTTP_STATUS.TOO_MANY_REQUESTS, message);
};

export const createInternalError = (message: string = 'Internal server error'): ApiError => {
  return new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message);
};
