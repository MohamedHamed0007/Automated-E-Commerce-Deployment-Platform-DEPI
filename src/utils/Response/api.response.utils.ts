import { Response } from 'express';

export const successResponse = (
  res: Response,
  message: string,
  data: any,
  statusCode = 200,
  extra?: any
) => {
  const response: any = {
    success: true,
    message,
    data
  };

  if (extra) Object.assign(response, extra);

  return res.status(statusCode).json(response);
};

export const errorResponse = (res: Response, message: string, statusCode: number = 500) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
};
